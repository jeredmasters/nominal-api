import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { ApiTokenEntity, IApiToken, IUnsavedApiToken } from "./api-token.entity";

export class ApiTokenRepository {
  getAll(): Promise<Array<IApiToken>> {
    return ApiTokenEntity.find()
  }
  getById(id: string): Promise<IApiToken | null> {
    return ApiTokenEntity.findOneBy({ id })
  }
  getByPublicKey(public_key: string): Promise<IApiToken | null> {
    return ApiTokenEntity.findOneBy({ public_key })
  }
  async getByIdOrThrow(id: string): Promise<IApiToken> {
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

  async save(unsaved: IUnsavedApiToken): Promise<IApiToken> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return ApiTokenEntity.save(unsaved as any);
  }
}
