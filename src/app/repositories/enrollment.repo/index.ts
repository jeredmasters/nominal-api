import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { EnrollmentEntity, IEnrollment } from "./enrollment.entity";
import { ElectionEntity } from "../election.repo/election.entity";

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
    return ElectionEntity
      .createQueryBuilder('el')
      .select('el.*')
      .leftJoin(EnrollmentEntity, 'en')
      .where('en.voter_id = :voter_id', { voter_id })
      .getMany();
  }
}
