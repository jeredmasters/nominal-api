import { Context, Get, Hook, HttpResponseOK, HttpResponseUnauthorized, Put } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { ElectionRepository } from "../../repositories/election.repo";
import { CandidateRepository } from "../../repositories/candidate.repo";
import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { AuthService } from "../../services/auth.service";
import { EnrollmentRepository } from "../../repositories/enrollment.repo";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { RunningRepository } from "../../repositories/running.repo";


export class CandidateController {
  @dependency
  private readonly electionRepository: ElectionRepository;

  @dependency
  private readonly enrollemntRepository: EnrollmentRepository;

  @dependency
  private readonly candidateRepository: CandidateRepository;

  @dependency
  private readonly authService: AuthService;

  @dependency
  private readonly runningRepository: RunningRepository;

  @Get("")
  async getRules({ request }: Context) {
    const authorization = request.headers['Authorization'];
    const voter = await this.authService.validate(authorization);


    return new HttpResponseOK(
      await this.enrollemntRepository.getEnrolledElections(voter?.id)
    );
  }

  @Get("/:id")
  async getRunAll({ request, user }: Context<IVoter>) {
    try {
      const { id } = request.params;
      return new HttpResponseOK(await this.electionRepository.getByIdOrThrow(id));
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  @Get("/:id/candidates")
  async getCandidates({ request }: Context) {
    try {
      const { id } = request.params;
      const authorization = request.headers['Authorization'];
      const voter = await this.authService.validate(authorization);

      const elections = await this.enrollemntRepository.getEnrolledElections(voter.id)
      if (elections.find(e => e.id === id) === undefined) {
        throw new InternalError({
          code: "election_not_found",
          func: "getCandidates",
          context: id,
          type: ERROR_TYPE.NOT_FOUND
        })
      }

      return new HttpResponseOK(
        await this.runningRepository.getRunningCandidates(id)
      );
    } catch (err) {
      return new HttpResponseUnauthorized(err)
    }
  }
}
