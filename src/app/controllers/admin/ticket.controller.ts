import { TicketEntity } from "../../repositories/ticket.repo/ticket.entity";
import { AdminBaseController } from "../util";

export class TicketController extends AdminBaseController {
  constructor() {
    super(TicketEntity)
  }

}
