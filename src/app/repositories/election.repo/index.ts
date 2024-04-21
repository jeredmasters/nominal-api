import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { ElectionEntity, IElection, IUnsavedElection } from "./election.entity";

export class ElectionRepository {
  getAll(): Promise<Array<IElection>> {
    return ElectionEntity.find()
  }
  getById(id: string): Promise<IElection | null> {
    return ElectionEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IElection> {
    const election = await this.getById(id);
    if (!election) {
      throw new InternalError({
        code: "election_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return election;
  }

  async save(unsaved: IUnsavedElection) {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return ElectionEntity.save(unsaved as any);
  }
}
