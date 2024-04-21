import { Context, Get, HttpResponseInternalServerError } from "@foal/core";

import { applyRestQuery } from "../util";
import { EmailTokenEntity } from "../../repositories/email-token.repo/email-token.entity";

export class EmailTokenController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(EmailTokenEntity, query)
    }
    catch (err) {
      console.error(err);
      return new HttpResponseInternalServerError(err)
    }
  }
}
