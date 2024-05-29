import { Context, HttpResponseOK, Post, dependency } from "@foal/core";
import { Get, HttpResponseBadRequest, HttpResponseInternalServerError } from "@foal/core/lib/core/http";
import { EmailTokenRepository } from "../../repositories/email-token.repo";
import { EMAIL_TOKEN_STATUS } from "../../repositories/email-token.repo/email-token.entity";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { AuthService } from "../../services/auth.service";
import { EventLogRepository } from "../../repositories/event_log.repo";
import { EVENT_PRIMARY } from "../../repositories/event_log.repo/event-log.entity";
import { errorToResponse } from "../util";

export class __AuthController {
  @dependency
  emailTokenRepository: EmailTokenRepository;

  @dependency
  authService: AuthService;

  @dependency
  eventLogRepository: EventLogRepository;

  @Post("/email_token")
  async postEmailToken({ request }: Context) {
    try {
      const { email_token_id } = request.body;
      const email_token = await this.emailTokenRepository.getById(email_token_id);
      if (!email_token) {
        return new HttpResponseBadRequest(new InternalError({
          code: "email_token_not_found",
          func: "postEmailToken",
          context: email_token_id,
          type: ERROR_TYPE.NOT_FOUND
        }));
      }
      if (email_token.status === EMAIL_TOKEN_STATUS.EXPIRED) {
        return new HttpResponseBadRequest(new InternalError({
          code: "email_token_expired",
          func: "postEmailToken",
          context: email_token_id,
          type: ERROR_TYPE.NOT_ALLOWED
        }));
      }
      if (email_token.status === EMAIL_TOKEN_STATUS.DISABLED) {
        return new HttpResponseBadRequest(new InternalError({
          code: "email_token_disabled",
          func: "postEmailToken",
          context: email_token_id,
          type: ERROR_TYPE.NOT_ALLOWED
        }));
      }
      await this.emailTokenRepository.setStatus(email_token.id, EMAIL_TOKEN_STATUS.OPENED);

      const api_token = await this.authService.create(email_token.voter_id, email_token.id);
      await this.eventLogRepository.save({
        primary: EVENT_PRIMARY.OPEN_EMAIL_TOKEN,
        email_token_id: email_token.id,
        api_token_id: api_token.id,
        voter_id: email_token.voter_id
      })
      return new HttpResponseOK({ api_token, email_token });
    } catch (err) {
      return errorToResponse(err)
    }
  }

}
