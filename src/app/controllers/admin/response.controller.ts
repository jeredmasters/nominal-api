import { Context, Get, HttpResponseInternalServerError } from "@foal/core";

import { applyRestQuery } from "../util";
import { ResponseEntity } from "../../repositories/response.repo/reponse.entity";

export class ResponseController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(ResponseEntity, query)
    }
    catch (err) {
      console.error(err);
      return new HttpResponseInternalServerError(err)
    }
  }
}
