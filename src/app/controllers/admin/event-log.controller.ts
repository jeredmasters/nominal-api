import { EventLogEntity } from "../../repositories/event_log.repo/event-log.entity";
import { AdminBaseController } from "../util";

export class EventLogController extends AdminBaseController {
  constructor() {
    super(EventLogEntity)
  }

}
