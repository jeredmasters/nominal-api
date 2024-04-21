import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AdminTokenEntity, IAdminToken, IUnsavedAdminToken } from "./admin-token.entity";

export class AdminTokenRepository {
  getAll(): Promise<Array<IAdminToken>> {
    return AdminTokenEntity.find()
  }
  getById(id: string): Promise<IAdminToken | null> {
    return AdminTokenEntity.findOneBy({ id })
  }
  getByPublicKey(public_key: string): Promise<IAdminToken | null> {
    return AdminTokenEntity.findOneBy({ public_key })
  }
  async getByIdOrThrow(id: string): Promise<IAdminToken> {
    const account = await this.getById(id);
    if (!account) {
      throw new InternalError({
        code: "admin_token_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return account;
  }

  async save(unsaved: IUnsavedAdminToken): Promise<IAdminToken> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return AdminTokenEntity.save(unsaved as any);
  }
}
