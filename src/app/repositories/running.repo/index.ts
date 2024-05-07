import { RunningEntity, IRunning, IUnsavedRunning } from "./running.entity";
import { ElectionEntity } from "../election.repo/election.entity";
import { CandidateEntity } from "../candidate.repo/candidate.entity";
import { PromiseCacheManager } from "../../util/promise-cache";
import { BaseRepo } from "../base-repo";

export class RunningRepository extends BaseRepo<RunningEntity, IRunning, IUnsavedRunning> {
  constructor() {
    super(RunningEntity, "ru")
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
