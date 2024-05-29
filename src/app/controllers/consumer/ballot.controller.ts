import { Context, Get, Hook, HttpResponseOK, HttpResponseUnauthorized, Post, Put } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { IVoter, VOTER_STATUS } from "../../repositories/voter.repo/voter.entity";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { RunningRepository } from "../../repositories/running.repo";
import { errorToResponse } from "../util";
import { BallotRepository } from "../../repositories/ballot.repo";
import { EnrollmentService } from "../../services/enrollment.service";
import { randInt } from "../../util/rand";
import { ResponseRepository } from "../../repositories/response.repo";
import { VoterRepository } from "../../repositories/voter.repo";


export class BallotController {
  @dependency
  private readonly ballotRepo: BallotRepository;

  @dependency
  private readonly enrollmentService: EnrollmentService;

  @dependency
  private readonly runningRepo: RunningRepository;

  @dependency
  private readonly responseRepo: ResponseRepository;

  @dependency
  private readonly voterRepo: VoterRepository;

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

      const candidates = await this.runningRepo.getRunningCandidates(id);
      if (ballot.shuffle_candidates) {
        for (let i = 0; i < candidates.length; i++) {
          candidates[i].display_order = randInt(0, Number.MAX_SAFE_INTEGER);
        }
      }


      return new HttpResponseOK(
        candidates
      );
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Post("/:ballot_id/response")
  async postNewResponse({ request, user: voter }: Context<IVoter>) {
    try {
      const { body } = request;
      if (!body) {
        throw new InternalError({
          code: "post_body_required",
          func: "postNewResponse",
          type: ERROR_TYPE.BAD_INPUT
        })
      }
      const { ballot_id } = request.params;
      const ballot = await this.ballotRepo.getByIdOrThrow(ballot_id);

      const eligible = await this.enrollmentService.isEligible(voter, ballot);

      if (!eligible) {
        throw new InternalError({
          code: "ballot_id_not_found",
          func: "postNewResponse",
          type: ERROR_TYPE.NOT_FOUND,
          context: ballot_id
        });
      }

      const saved = await this.responseRepo.save({
        ballot_id: ballot.id,
        value: request.body,
        voter_id: voter.id
      })

      const ballots = await this.enrollmentService.getEligibleBallots(voter);
      const responses = await this.responseRepo.getByVoterId(voter.id)

      let complete = true;
      for (const b of ballots) {
        const response = responses.find(r => r.ballot_id === b.id);
        if (response === undefined) {
          complete = false;
          break;
        }
      }

      await this.voterRepo.setStatus(voter.id, complete ? VOTER_STATUS.SUBMITTED : VOTER_STATUS.PARTIAL_SUBMIT);

      return new HttpResponseOK(saved);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }
}
