import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { VoterEntity } from "../../repositories/voter.repo/voter.entity";
import { AdminBaseController, errorToResponse } from "../util";
import { Context, HttpResponseOK, Post, dependency } from "@foal/core";
import { EmailService } from "../../services/email.service";
import { VoterRepository } from "../../repositories/voter.repo";

export class VoterController extends AdminBaseController {
  constructor() {
    super(VoterEntity, "v")
  }
  @dependency
  emailService: EmailService;

  @dependency
  voterRepo: VoterRepository;

  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    console.log("OVERRIDE FILTER", field)

    switch (field) {
      case "q":
        queryBuilder.andWhere('(v.first_name ilike :q OR v.last_name ilike :q)', { q: value });
        break;

      default:
        super.applyFilter(queryBuilder, field, value);
        break;

    }
  }

  @Post("/:id/send_invite")
  async postSendInvite({ request }: Context) {
    try {
      const { id } = request.params;
      const voter = await this.voterRepo.getByIdOrThrow(id);
      const result = await this.emailService.sendEnrollmentInvitation(voter);
      return new HttpResponseOK(result);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }

}
