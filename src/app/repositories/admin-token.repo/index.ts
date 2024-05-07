import { BaseRepo } from "../base-repo";
import { AdminTokenEntity, IAdminToken, IUnsavedAdminToken } from "./admin-token.entity";


export class AdminTokenRepository extends BaseRepo<AdminTokenEntity, IAdminToken, IUnsavedAdminToken> {
  constructor() {
    super(AdminTokenEntity, "v")
  }

  getByPublicKey(public_key: string): Promise<IAdminToken | null> {
    return AdminTokenEntity.findOneBy({ public_key })
  }

}