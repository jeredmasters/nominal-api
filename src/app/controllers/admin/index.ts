import {
  Context,
  controller,
  dependency,
  Get,
  Hook,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Options,
  Post,
} from "@foal/core";
import { ElectionController } from "./election.controller";
import { EmailTokenController } from "./email-token.controller";
import { EventLogController } from "./event-log.controller";
import { OrganisationController } from "./organisation.controller";
import { ResponseController } from "./response.controller";
import { VoterController } from "./voter.controller";
import { EmailTokenRepository } from "../../repositories/email-token.repo";
import { AdminAuthService } from "../../services/admin-auth.service";
import { errorToResponse } from "../util";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { IAdminUser } from "../../repositories/admin-user.repo/admin-user.entity";
import { RunningController } from "./running.controller";
import { CandidateController } from "./candidate.controller";
import { EnrollmentController } from "./enrollment.controller";
import { BallotController } from "./ballot.controller";
import { AdminUserController } from "./admin-user.controller";
import { env } from "../../util/env";

@Hook((ctx) => (response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    ctx.request.get("Origin") || "*"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Total-Count");
  response.setHeader("Access-Control-Expose-Headers", "Content-Type,Authorization,X-Total-Count");

})
export class AdminController {
  subControllers = [
    controller("/auth", AuthController),
  ];

  @dependency
  emailTokenRepository: EmailTokenRepository;

  @dependency
  adminAuthService: AdminAuthService;

  @Post("/login")
  async postLogin({ request }: Context) {
    try {
      const { email, password } = request.body;

      const token = await this.adminAuthService.login(email, password);

      return new HttpResponseOK(token);
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
    const adminAuthService = services.get(AdminAuthService);
    ctx.user = await adminAuthService.validate(authorization);
  }
  catch (err) {
    return errorToResponse(err)
  }
})
export class AuthController {
  subControllers = [
    controller("/elections", ElectionController),
    controller("/candidates", CandidateController),
    controller("/email_tokens", EmailTokenController),
    controller("/event_log", EventLogController),
    controller("/organisations", OrganisationController),
    controller("/responses", ResponseController),
    controller("/voters", VoterController),
    controller("/runnings", RunningController),
    controller("/enrollments", EnrollmentController),
    controller("/email-tokens", EmailTokenController),
    controller('/ballots', BallotController),
    controller("/admin-users", AdminUserController)
  ];

  @Get("/status")
  async getStatus({ request, user }: Context<IAdminUser>) {
    try {
      return new HttpResponseOK(user);
    } catch (err) {
      return errorToResponse(err)
    }
  }

  @Get("/config")
  async getConfig({ request, user }: Context<IAdminUser>) {
    try {
      return new HttpResponseOK({
        consumer_fe_url: env.consumerFeUrl()
      });
    } catch (err) {
      return errorToResponse(err)
    }
  }
}