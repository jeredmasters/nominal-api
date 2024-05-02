
import { ObjectLiteral } from "typeorm";
import { EnrollmentEntity } from "../../repositories/enrollment.repo/enrollment.entity";
import { AdminBaseController, errorToResponse } from "../util";
import { Context, HttpResponseOK, Post, dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";
import { EnrollmentRepository } from "../../repositories/enrollment.repo";

export class EnrollmentController extends AdminBaseController<EnrollmentEntity> {
  constructor() {
    super(EnrollmentEntity)
  }

  @dependency
  emailService: EmailService;

  @dependency
  enrollmentREporitory: EnrollmentRepository;

  async afterCreate(raw: any, item: EnrollmentEntity): Promise<EnrollmentEntity> {
    if (raw.send_invite) {
      await this.emailService.sendEnrollmentInvitation(item);
    }
    return item;
  }

  @Post("/:id/send_invite")
  async sendInvite({ request }: Context) {
    try {
      const { id } = request.params;
      const enrollment = await this.enrollmentREporitory.getByIdOrThrow(id);
      const result = await this.emailService.sendEnrollmentInvitation(enrollment);
      return new HttpResponseOK(result);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }
}
