import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { Voter, IVoter, IUnsavedVoter } from "./voter.entity";
import { IBaseUnsaved } from "../base";

export class VoterRepository {
  getAll(): Promise<Array<IVoter>> {
    return Voter.find()
  }
  getById(id: string): Promise<IVoter | null> {
    return Voter.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IVoter> {
    const account = await this.getById(id);
    if (!account) {
      throw new InternalError({
        code: "account_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return account;
  }
  async save(unsaved: IUnsavedVoter) {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return Voter.save(unsaved as any);
  }
}
