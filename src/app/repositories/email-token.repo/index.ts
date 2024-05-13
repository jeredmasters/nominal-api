import { EMAIL_TOKEN_STATUS, EmailTokenEntity, IEmailToken, IUnsavedEmailToken } from "./email-token.entity";
import { BaseRepo } from "../base-repo";

export class EmailTokenRepository extends BaseRepo<EmailTokenEntity, IEmailToken, IUnsavedEmailToken> {
  constructor() {
    super(EmailTokenEntity, 'eb');
  }


  setStatus(id: string, status: EMAIL_TOKEN_STATUS) {
    return EmailTokenEntity.update(id, { status });
  }

}
