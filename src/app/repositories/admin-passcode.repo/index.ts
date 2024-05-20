import { ERROR_TYPE, InternalError } from "../../domain/error";
import { hashPassword } from "../../util/crypto";
import { AdminLogEntity } from "../admin_log.repo/admin-log.entity";
import { BaseRepo } from "../base-repo";
import { AdminPasscodeEntity, IAdminPasscode, IUnsavedAdminPasscode, PASSCODE_TYPE } from "./admin-passcode.entity";

export class AdminPasscodeRepository extends BaseRepo<AdminPasscodeEntity, IAdminPasscode, IUnsavedAdminPasscode> {
  constructor() {
    super(AdminPasscodeEntity, 'ap');
  }
  async save(unsaved: IUnsavedAdminPasscode): Promise<IAdminPasscode> {
    if (unsaved.type === PASSCODE_TYPE.PASSWORD) {
      unsaved.value = await hashPassword(unsaved.value);
    }
    return super.save(unsaved);
  }
  getPasscodeForUser(admin_user_id: string, type: PASSCODE_TYPE) {
    return AdminPasscodeEntity
      .createQueryBuilder()
      .where({ admin_user_id, type })
      .orderBy('created_at', 'DESC')
      .limit(1)
      .getOne()
  }
}
