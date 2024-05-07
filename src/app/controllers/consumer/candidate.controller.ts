import { Context, Get, HttpResponseOK } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { ElectionRepository } from "../../repositories/election.repo";
import { IVoter } from "../../repositories/voter.repo/voter.entity";



export class CandidateController {
  @dependency
  private readonly electionRepository: ElectionRepository;

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

}
