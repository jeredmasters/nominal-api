import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { CandidateEntity, ICandidate, IUnsavedCandidate } from "./candidate.entity";

export class CandidateRepository {
  getAll(): Promise<Array<ICandidate>> {
    return CandidateEntity.find()
  }
  getById(id: string): Promise<ICandidate | null> {
    return CandidateEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<ICandidate> {
    const candidate = await this.getById(id);
    if (!candidate) {
      throw new InternalError({
        code: "candidate_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return candidate;
  }

  async save(unsaved: IUnsavedCandidate) {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return CandidateEntity.save(unsaved as any);
  }
}
