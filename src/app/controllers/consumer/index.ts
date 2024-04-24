import {
  Context,
  controller,
  dependency,
  Get,
  Hook,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseOK,
  Options,
  Post,
} from "@foal/core";
import { ElectionController } from "./election.controller";
import { InternalError, ERROR_TYPE } from "../../domain/error";
import { EMAIL_TOKEN_STATUS, IAdminUser } from "../../repositories/admin-user.repo/admin-user.entity";
import { EmailTokenRepository } from "../../repositories/email-token.repo";
import { ConsumerAuthService } from "../../services/consumer-auth.service";
import { errorToResponse } from "../util";
import { EventLogRepository } from "../../repositories/event_log.repo";
import { EVENT_PRIMARY } from "../../repositories/event_log.repo/event-log.entity";
import { AuthService } from "../../services/auth.service";
import { EnrollmentController } from "../admin/enrollment.controller";
import { CandidateController } from "./candidate.controller";
import { ResponseController } from "./response.controller";

@Hook((ctx) => (response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    ctx.request.get("Origin") || "*"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Total-Count");
  response.setHeader("Access-Control-Expose-Headers", "Content-Type,Authorization,X-Total-Count");
})
export class ConsumerController {
  subControllers = [
    controller("/auth", AuthController),
  ];

  @dependency
  emailTokenRepository: EmailTokenRepository;

  @dependency
  authService: AuthService;

  @dependency
  eventLogRepository: EventLogRepository;

  @Post("/email_token")
  async postEmailToken({ request }: Context) {
    try {
      console.log(request.body)
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
      return new HttpResponseOK(api_token);
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/health")
  getHealth() {
    return new HttpResponseOK({
      status: "good"
    })
  }

  @Options("*")
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader(
      "Access-Control-Allow-Methods",
      "HEAD, GET, POST, PUT, PATCH, DELETE"
    );
    // You may need to allow other headers depending on what you need.

    return response;
  }
}

@Hook(async (ctx, services) => {
  try {
    const authorization = ctx.request.get("Authorization");
    console.log({ authorization })
    if (!authorization) {
      return errorToResponse(new InternalError({
        code: "authoirzation_missing",
        func: "",
        type: ERROR_TYPE.NOT_ALLOWED
      }))
    }
    const consumerAuthService = services.get(ConsumerAuthService);
    ctx.user = await consumerAuthService.validate(authorization);
  }
  catch (err) {
    return errorToResponse(err)
  }
})
export class AuthController {
  subControllers = [
    controller("/elections", ElectionController),
    controller("/candidates", CandidateController),
    controller("/responses", ResponseController),
    controller("/enrollments", EnrollmentController),
  ];

  @Get("/status")
  async getStatus({ request, user }: Context<IAdminUser>) {
    try {
      return new HttpResponseOK(user);
    } catch (err) {
      return errorToResponse(err)
    }
  }
}