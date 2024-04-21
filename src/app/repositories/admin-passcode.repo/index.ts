import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AdminPasscode, IAdminPasscode, IUnsavedAdminPasscode, PASSCODE_TYPE } from "./admin-passcode.entity";

export class AdminPasscodeRepository {
  getAll(): Promise<Array<IAdminPasscode>> {
    return AdminPasscode.find()
  }
  getById(id: string): Promise<IAdminPasscode | null> {
    return AdminPasscode.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IAdminPasscode> {
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

  async save(unsaved: IUnsavedAdminPasscode): Promise<IAdminPasscode> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return AdminPasscode.save(unsaved as any);
  }

  getPasscodeForUser(admin_user_id: string, type: PASSCODE_TYPE) {
    return AdminPasscode
      .createQueryBuilder()
      .where({ admin_user_id, type })
      .orderBy('created_at', 'DESC')
      .limit(1)
      .getOne()
  }
}
