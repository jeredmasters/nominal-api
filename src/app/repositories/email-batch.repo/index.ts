import { EmailBatchEntity, IEmailBatch, IUnsavedEmailBatch } from "./email-batch.entity";
import { BaseRepo } from "../base-repo";

export class EmailBatchRepository extends BaseRepo<EmailBatchEntity, IEmailBatch, IUnsavedEmailBatch> {
  constructor() {
    super(EmailBatchEntity, 'eb');
  }
}
