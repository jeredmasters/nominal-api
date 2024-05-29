import { BaseRepo } from "../base-repo";
import { TicketMessageEntity, ITicketMessage, IUnsavedTicketMessage } from "./ticket-message.entity";

export class TicketMessageRepository extends BaseRepo<TicketMessageEntity, ITicketMessage, IUnsavedTicketMessage> {
  constructor() {
    super(TicketMessageEntity, 'b');
  }
  getByTicketId(ticket_id: string): Promise<ITicketMessage[]> {
    return this.createQueryBuilder().where({ ticket_id }).orderBy('created_at', 'ASC').getRawMany();
  }
}
