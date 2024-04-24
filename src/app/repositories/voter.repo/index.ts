import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { VoterEntity, IVoter, IUnsavedVoter } from "./voter.entity";
import { IBaseUnsaved } from "../base";

export class VoterRepository {
  getAll(): Promise<Array<IVoter>> {
    return VoterEntity.find()
  }
  getById(id: string): Promise<IVoter | null> {
    return VoterEntity.findOneBy({ id })
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
  async save(unsaved: IUnsavedVoter): Promise<IVoter> {
    return VoterEntity.save(unsaved as any);
  }
}
