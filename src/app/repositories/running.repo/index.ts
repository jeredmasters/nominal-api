import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { RunningEntity, IRunning } from "./running.entity";
import { ElectionEntity } from "../election.repo/election.entity";
import { CandidateEntity, ICandidate } from "../candidate.repo/candidate.entity";
import { PromiseCache, PromiseCacheManager } from "../../util/promise-cache";

export class RunningRepository {
  getAll(): Promise<Array<IRunning>> {
    return RunningEntity.find()
  }
  getById(id: string): Promise<IRunning | null> {
    return RunningEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IRunning> {
    const enrollment = await this.getById(id);
    if (!enrollment) {
      throw new InternalError({
        code: "enrollment_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return enrollment;
  }

  getRunningElections(candidate_id: string) {
    return ElectionEntity
      .createQueryBuilder('el')
      .select('el.*')
      .leftJoin(RunningEntity, 'r', 'el.id = r.ballot_id')
      .where('r.candidate_id = :candidate_id', { candidate_id })
      .getRawMany();
  }


  getRunningCandidates(ballot_id: string) {
    return CandidateEntity
      .createQueryBuilder('c')
      .select('c.*')
      .leftJoin(RunningEntity, 'r', 'c.id = r.candidate_id')
      .where('r.ballot_id = :ballot_id', { ballot_id })
      .getRawMany();
  }

  cache = new PromiseCacheManager()
  async getOrCreateRunning(candidate_id: string, ballot_id: string) {
    return this.cache.call(`getOrCreateRunning(${candidate_id},${ballot_id})`, {}, async () => {
      const exists = await RunningEntity.findOneBy({ candidate_id, ballot_id });
      if (exists) {
        return exists;
      }
      return RunningEntity.save({
        ballot_id,
        candidate_id
      });
    });
  }

  getByElectionId(ballot_id: string): Promise<Array<IRunning>> {
    return RunningEntity.findBy({ ballot_id })
  }
}
