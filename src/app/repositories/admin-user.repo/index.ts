import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AdminUserEntity, IAdminUser, IUnsavedAdminUser } from "./admin-user.entity";

export class AdminUserRepository {
  getAll(): Promise<Array<IAdminUser>> {
    return AdminUserEntity.find()
  }
  getById(id: string): Promise<IAdminUser | null> {
    return AdminUserEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IAdminUser> {
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


  getByEmail(email: string): Promise<IAdminUser | null> {
    return AdminUserEntity.findOneBy({ email })
  }

  async save(unsaved: IUnsavedAdminUser): Promise<IAdminUser> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return AdminUserEntity.save(unsaved as any);
  }
}
