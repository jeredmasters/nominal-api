import { Context, Get } from "@foal/core";

import { applyRestQuery, errorToResponse } from "../util";
import { ElectionEntity } from "../../repositories/election.repo/election.entity";

export class ElectionController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(ElectionEntity, query)
    }
    catch (err) {
      return errorToResponse(err)
    }
  }
}
