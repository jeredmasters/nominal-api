import { Context, Get, HttpResponseInternalServerError } from "@foal/core";

import { applyRestQuery } from "../util";
import { VoterEntity } from "../../repositories/voter.repo/voter.entity";

export class VoterController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(VoterEntity, query)
    }
    catch (err) {
      console.error(err);
      return new HttpResponseInternalServerError(err)
    }
  }
}
