import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AdminPermissionEntity, IAdminPermission, IUnsavedAdminPermission } from "./admin-permission.entity";

export class AdminPermissionRepository {
  getAll(): Promise<Array<IAdminPermission>> {
    return AdminPermissionEntity.find()
  }
  getById(id: string): Promise<IAdminPermission | null> {
    return AdminPermissionEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IAdminPermission> {
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

  async save(unsaved: IUnsavedAdminPermission): Promise<IAdminPermission> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return AdminPermissionEntity.save(unsaved as any);
  }
}
