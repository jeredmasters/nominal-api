import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { Enrollment, IEnrollment } from "./enrollment.entity";
import { Election } from "../election.repo/election.entity";

export class EnrollmentRepository {
  getAll(): Promise<Array<IEnrollment>> {
    return Enrollment.find()
  }
  getById(id: string): Promise<IEnrollment | null> {
    return Enrollment.findOneBy({ id })
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
    return Election
      .createQueryBuilder('el')
      .select('el.*')
      .leftJoin(Enrollment, 'en')
      .where('en.voter_id = :voter_id', { voter_id })
      .getMany();
  }
}
