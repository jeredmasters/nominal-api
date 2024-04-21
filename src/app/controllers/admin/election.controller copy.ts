import { Context, Get } from "@foal/core";

import { applyRestQuery, errorToResponse } from "../util";
import { CandidateEntity } from "../../repositories/candidate.repo/candidate.entity";

export class CandidateController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(CandidateEntity, query)
    }
    catch (err) {
      return errorToResponse(err)
    }
  }
}
