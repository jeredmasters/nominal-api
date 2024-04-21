import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AdminLogEntity, IAdminLog, IUnsavedAdminLog } from "./admin-log.entity";

export class AdminLogRepository {
  getAll(): Promise<Array<IAdminLog>> {
    return AdminLogEntity.find()
  }
  getById(id: string): Promise<IAdminLog | null> {
    return AdminLogEntity.findOneBy({ id });
  }

  async getByIdOrThrow(id: string): Promise<IAdminLog> {
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

  async save(unsaved: IUnsavedAdminLog) {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return AdminLogEntity.save(unsaved as any);
  }
}
