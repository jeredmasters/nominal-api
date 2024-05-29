
import { TicketEntity, ITicket, IUnsavedTicket } from "./ticket.entity";
import { BaseRepo } from "../base-repo";

export class TicketRepository extends BaseRepo<TicketEntity, ITicket, IUnsavedTicket> {
  constructor() {
    super(TicketEntity, 'b');
  }
  getByElectionId(election_id: string): Promise<ITicket[]> {
    return TicketEntity.findBy({ election_id })
  }
  getByVoterId(voter_id: string): Promise<ITicket[]> {
    return TicketEntity.findBy({ voter_id })
  }
}
