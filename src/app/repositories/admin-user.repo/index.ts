import { AdminUserEntity, IAdminUser, IUnsavedAdminUser } from "./admin-user.entity";
import { BaseRepo } from "../base-repo";


export class AdminUserRepository extends BaseRepo<AdminUserEntity, IAdminUser, IUnsavedAdminUser> {
  constructor() {
    super(AdminUserEntity, "v")
  }


  getByEmail(email: string): Promise<IAdminUser | null> {
    return AdminUserEntity.findOneBy({ email })
  }

}
