
import { AdminBaseController } from "../util";
import { EmailTokenEntity } from "../../repositories/email-token.repo/email-token.entity";

export class EmailTokenController extends AdminBaseController {
  constructor() {
    super(EmailTokenEntity, "et")
  }

}
