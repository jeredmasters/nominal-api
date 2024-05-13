
import { AdminBaseController } from "../util";

import { SelectQueryBuilder, ObjectLiteral } from "typeorm";
import { dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";
import { ElectionEntity } from "../../repositories/election.repo/election.entity";
import { EMAIL_BATCH_STATUS, EmailBatchEntity } from "../../repositories/email-batch.repo/email-batch.entity";

export class EmailBatchController extends AdminBaseController {
  constructor() {
    super(EmailBatchEntity, "eb")
  }

  @dependency
  emailService: EmailService


  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "organisation_id":
        queryBuilder.leftJoin(ElectionEntity, 'e', "e.id = eb.election_id")
        queryBuilder.andWhere('e.organisation_id = :organisation_id', { organisation_id: value })
        break;
      default:
        super.applyFilter(queryBuilder, field, value);
        break;
    }
  }

  async beforeCreate(raw: any) {
    if (!raw.status) {
      raw.status = EMAIL_BATCH_STATUS.ENABLED;
    }
    return raw
  }
}
