
import { ObjectLiteral } from "typeorm";
import { EnrollmentEntity } from "../../repositories/enrollment.repo/enrollment.entity";
import { AdminBaseController } from "../util";
import { dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";

export class EnrollmentController extends AdminBaseController<EnrollmentEntity> {
  constructor() {
    super(EnrollmentEntity)
  }

  @dependency
  emailService: EmailService;

  async afterCreate(raw: any, item: EnrollmentEntity): Promise<EnrollmentEntity> {
    await this.emailService.sendInvitation(item);
    return item;
  }
}
