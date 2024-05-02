import { AdminBaseController } from "../util";
import { AdminUserEntity } from "../../repositories/admin-user.repo/admin-user.entity";


export class AdminUserController extends AdminBaseController {
  constructor() {
    super(AdminUserEntity, "e")
  }

}
