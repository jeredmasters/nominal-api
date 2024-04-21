import { Context, Get, HttpResponseInternalServerError } from "@foal/core";

import { applyRestQuery } from "../util";
import { EventLogEntity } from "../../repositories/event_log.repo/event-log.entity";

export class EventLogController {
  @Get('')
  async index(ctx: Context) {
    try {
      const query = ctx.request.query;
      console.log({ query })
      return await applyRestQuery(EventLogEntity, query)
    }
    catch (err) {
      console.error(err);
      return new HttpResponseInternalServerError(err)
    }
  }
}
