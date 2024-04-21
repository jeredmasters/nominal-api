import { Context, Get, HttpResponseInternalServerError } from "@foal/core";

import { applyRestQuery } from "../util";
import { OrganisationEntity } from "../../repositories/organisation.repo/organisation.entity";

export class OrganisationController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(OrganisationEntity, query)
    }
    catch (err) {
      console.error(err);
      return new HttpResponseInternalServerError(err)
    }
  }
}
