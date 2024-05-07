
import { AdminBaseController } from "../util";
import { EMAIL_TOKEN_ACTION, EMAIL_TOKEN_STATUS, EmailTokenEntity, IEmailToken } from "../../repositories/email-token.repo/email-token.entity";
import { VoterEntity } from "../../repositories/voter.repo/voter.entity";
import { SelectQueryBuilder, ObjectLiteral } from "typeorm";
import { dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";

export class EmailTokenController extends AdminBaseController {
  constructor() {
    super(EmailTokenEntity, "et")
  }

  @dependency
  emailService: EmailService


  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "organisation_id":
        queryBuilder.leftJoin(VoterEntity, 'v', "v.id = et.voter_id")
        queryBuilder.andWhere('v.organisation_id = :organisation_id', { organisation_id: value })
        return true;
      default:
        super.applyFilter(queryBuilder, field, value);
        break;
    }
    return false
  }

  async beforeCreate(raw: any): Promise<any> {
    if (!raw.action) {
      if (raw.election_id) {
        raw.action = EMAIL_TOKEN_ACTION.SINGLE_VOTE
      } else {
        raw.action = EMAIL_TOKEN_ACTION.LOGIN
      }
    }
    if (!raw.status) {
      raw.status = EMAIL_TOKEN_STATUS.UNUSED
    }
    return raw;
  }

  async afterCreate(raw: any, item: IEmailToken): Promise<ObjectLiteral> {
    await this.emailService.sendInvitation(item)
    return item;
  }
}
