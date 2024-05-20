
import { AdminBaseController } from "../util";

import { SelectQueryBuilder, ObjectLiteral } from "typeorm";
import { dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";
import { ElectionEntity } from "../../repositories/election.repo/election.entity";
import { EMAIL_BATCH_STATUS, EmailBatchEntity } from "../../repositories/email-batch.repo/email-batch.entity";
import { VoterFilterService } from "../../services/voter-filter.service";
import { IUnsavedVoterFilter, VoterFilterEntity } from "../../repositories/voter-filter.repo/voter-filter.entity";
import { VoterFilterRepository } from "../../repositories/voter-filter.repo";
import { IUnsavedVoter } from "../../repositories/voter.repo/voter.entity";

export class EmailBatchController extends AdminBaseController<EmailBatchEntity> {
  constructor() {
    super(EmailBatchEntity, "eb")
  }

  @dependency
  emailService: EmailService

  @dependency
  voterFilterService: VoterFilterService;

  @dependency
  voterFilterRepo: VoterFilterRepository;


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
    if (raw.voter_filter) {
      const unsaved: IUnsavedVoterFilter = {
        election_id: raw.election_id,
        where: raw.voter_filter,
        voter_count: 0
      }
      const voterFilter = await this.voterFilterService.saveWithMetadata(unsaved);
      delete raw.voter_filter;
      raw.voter_filter_id = voterFilter.id;
    }
    return raw
  }

  async afterCreate(raw: any, item: EmailBatchEntity): Promise<EmailBatchEntity> {
    if (item.voter_filter_id) {
      this.voterFilterRepo.updatEmailBatchId(item.voter_filter_id, item.id);
    }

    return item;
  }

  beforeQuery(queryBuilder: SelectQueryBuilder<ObjectLiteral>): void {
    queryBuilder.leftJoin(VoterFilterEntity, 'vf', 'eb.voter_filter_id = vf.id');
    queryBuilder.addSelect('vf.voter_count')
  }
}
