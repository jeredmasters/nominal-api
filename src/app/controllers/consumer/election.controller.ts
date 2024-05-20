import { Context, Get, Hook, HttpResponseOK, HttpResponseUnauthorized, Put } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { ElectionRepository } from "../../repositories/election.repo";
import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { AuthService } from "../../services/auth.service";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { RunningRepository } from "../../repositories/running.repo";
import { errorToResponse } from "../util";
import { BallotRepository } from "../../repositories/ballot.repo";
import { EnrollmentService } from "../../services/enrollment.service";


export class ElectionController {
  @dependency
  private readonly electionRepository: ElectionRepository;

  @dependency
  private readonly ballotRepo: BallotRepository;

  @dependency
  private readonly enrollmentService: EnrollmentService;

  @Get("")
  async getRules({ request, user }: Context<IVoter>) {
    try {
      return new HttpResponseOK(
        [await this.electionRepository.getById(user.election_id)]
      );
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/:id")
  async getRunAll({ request, user }: Context<IVoter>) {
    try {
      const { id } = request.params;
      return new HttpResponseOK(await this.electionRepository.getByIdOrThrow(id));
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/:id/ballots")
  async getBallots({ request, user }: Context<IVoter>) {
    try {
      const { id } = request.params;

      if (!await this.enrollmentService.isEnrolled(user, id)) {
        throw new InternalError({
          code: "not_enrolled",
          func: "getBallots",
          type: ERROR_TYPE.NOT_FOUND,
          meta: {
            voter_id: user.id,
            election_id: id
          }
        });
      }

      const ballots = await this.ballotRepo.getByElectionId(id)

      return new HttpResponseOK(
        ballots
      );
    } catch (err) {
      return errorToResponse(err)
    }
  }

}
