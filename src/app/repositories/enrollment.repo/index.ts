import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { EnrollmentEntity, IEnrollment } from "./enrollment.entity";
import { ElectionEntity } from "../election.repo/election.entity";
import { PromiseCacheManager } from "../../util/promise-cache";

export class EnrollmentRepository {
  getAll(): Promise<Array<IEnrollment>> {
    return EnrollmentEntity.find()
  }
  getById(id: string): Promise<IEnrollment | null> {
    return EnrollmentEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IEnrollment> {
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

  getEnrolledElections(voter_id: string) {
    return EnrollmentEntity
      .createQueryBuilder('en')
      .select('el.*')
      .leftJoin(ElectionEntity, 'el', 'el.id = en.election_id')
      .where('en.voter_id = :voter_id', { voter_id })
      .getRawMany();
  }

  async getEnrollment(voter_id: string, election_id: string) {
    return await EnrollmentEntity.findOneBy({ voter_id, election_id });
  }

  cache = new PromiseCacheManager();
  async getOrCreateEnrollment(voter_id: string, election_id: string) {
    return this.cache.call(`getOrCreateEnrollment(${voter_id},${election_id})`, {}, async () => {
      const exists = await EnrollmentEntity.findOneBy({ voter_id, election_id });
      if (exists) {
        return exists;
      }
      return EnrollmentEntity.save({
        election_id,
        voter_id
      })
    });
  }
  getByElectionId(election_id: string): Promise<Array<IEnrollment>> {
    return EnrollmentEntity.findBy({ election_id })
  }
}
