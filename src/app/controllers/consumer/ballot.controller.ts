import { Context, Get, Hook, HttpResponseOK, HttpResponseUnauthorized, Put } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { RunningRepository } from "../../repositories/running.repo";
import { errorToResponse } from "../util";
import { BallotRepository } from "../../repositories/ballot.repo";
import { EnrollmentService } from "../../services/enrollment.service";


export class BallotController {
  @dependency
  private readonly ballotRepo: BallotRepository;

  @dependency
  private readonly enrollmentService: EnrollmentService;

  @dependency
  private readonly runningRepo: RunningRepository;

  @Get("")
  async getRules({ request, user }: Context<IVoter>) {
    try {
      return new HttpResponseOK("PANTS");
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/:id")
  async getRunAll({ request, user }: Context<IVoter>) {

    try {
      const { id } = request.params;
      const ballot = await this.ballotRepo.getByIdOrThrow(id);
      if (!await this.enrollmentService.isEligible(user, ballot)) {
        throw new InternalError({
          code: "election_not_found",
          func: "getBallots",
          type: ERROR_TYPE.NOT_FOUND
        });
      }
      return new HttpResponseOK(ballot);
    } catch (err) {
      return errorToResponse(err)
    }
  }


  @Get("/:id/candidates")
  async getCandidates({ request, user }: Context<IVoter>) {
    try {
      const { id } = request.params;
      const ballot = await this.ballotRepo.getByIdOrThrow(id)
      if (!await this.enrollmentService.isEligible(user, ballot)) {
        throw new InternalError({
          code: "election_not_found",
          func: "getBallots",
          type: ERROR_TYPE.NOT_FOUND
        });
      }

      const candidates = await this.runningRepo.getRunningCandidates(id)


      return new HttpResponseOK(
        candidates
      );
    } catch (err) {
      return errorToResponse(err)
    }
  }
}
