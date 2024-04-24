import { Context, Get, HttpResponseOK } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { ElectionRepository } from "../../repositories/election.repo";
import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { ResponseRepository } from "../../repositories/response.repo";


export class ResponseController {
  @dependency
  private readonly electionRepository: ElectionRepository;

  @dependency
  private readonly responseRepository: ResponseRepository;

  @Get("")
  async getRules({ request, user }: Context<IVoter>) {
    return new HttpResponseOK(
      await this.responseRepository.getByVoterId(user.id)
    );
  }
}
