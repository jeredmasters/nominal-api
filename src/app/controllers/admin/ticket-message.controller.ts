import { TicketMessageEntity } from "../../repositories/ticket-message.repo/ticket-message.entity";
import { AdminBaseController } from "../util";

export class TicketMessageController extends AdminBaseController {
  constructor() {
    super(TicketMessageEntity)
  }

}
