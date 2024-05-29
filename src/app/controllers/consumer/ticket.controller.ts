import { Context, Get, HttpResponseOK, Post } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { errorToResponse } from "../util";
import { TicketRepository } from "../../repositories/ticket.repo";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { IUnsavedTicket } from "../../repositories/ticket.repo/ticket.entity";
import { TicketMessageRepository } from "../../repositories/ticket-message.repo";

const getSummary = (raw: Partial<IUnsavedTicket>): string => {
  if (raw.voter_summary) {
    return raw.voter_summary;
  }
  if (raw.voter_description) {
    return raw.voter_description.substring(0, 200);
  }
  return raw.reason || "unknown"
}

export class TicketController {
  @dependency
  private readonly ticketRepo: TicketRepository;

  @dependency
  private readonly ticketMessageRepo: TicketMessageRepository;

  @Get("")
  async getRules({ user: voter }: Context<IVoter>) {
    try {
      const tickets = await this.ticketRepo.getByVoterId(voter.id);

      return new HttpResponseOK(tickets);
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Post("")
  async postTicket({ request, user: voter }: Context<IVoter>) {

    try {
      const rawTicket: IUnsavedTicket = request.body;
      rawTicket.voter_id = voter.id;
      rawTicket.election_id = voter.election_id;

      const summary = rawTicket.voter_summary || rawTicket.voter_summary

      rawTicket.admin_summary = getSummary(rawTicket);
      rawTicket.voter_summary = getSummary(rawTicket);

      rawTicket.admin_description = "";



      const ticket = await this.ticketRepo.save(rawTicket);
      const message = await this.ticketMessageRepo.save({
        ticket_id: ticket.id,
        content: rawTicket.voter_description,
      });

      return new HttpResponseOK({ ticket, messages: [message] });
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/:id")
  async getRunAll({ request, user: voter }: Context<IVoter>) {

    try {
      const { id } = request.params;
      const ticket = await this.ticketRepo.getByIdOrThrow(id);
      if (ticket.voter_id !== voter.id) {
        throw new InternalError({
          code: "ticket_not_found",
          func: "getRunAll",
          type: ERROR_TYPE.NOT_FOUND
        })
      }
      const messages = await this.ticketMessageRepo.getByIdOrThrow(id);

      return new HttpResponseOK({ ticket, messages });
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Post("/:id/message")
  async postMessage({ request, user: voter }: Context<IVoter>) {

    try {
      const { id } = request.params;
      const rawMessage = request.body;
      const ticket = await this.ticketRepo.getByIdOrThrow(id);
      if (ticket.voter_id !== voter.id) {
        throw new InternalError({
          code: "ticket_not_found",
          func: "getRunAll",
          type: ERROR_TYPE.NOT_FOUND
        })
      }
      const new_message = await this.ticketMessageRepo.save({
        ticket_id: ticket.id,
        content: rawMessage.content
      });
      const messages = await this.ticketMessageRepo.getByIdOrThrow(id);

      return new HttpResponseOK({ ticket, messages, new_message });
    } catch (err) {
      return errorToResponse(err)
    }
  }
}
