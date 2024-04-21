import {
  Context,
  controller,
  Get,
  Hook,
  HttpResponseNoContent,
  HttpResponseOK,
  Options,
} from "@foal/core";
import { AuthController } from "./auth.controller";
import { ElectionController } from "./election.controller";

@Hook((ctx) => (response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    ctx.request.get("Origin") || "*"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");
})
export class ConsumerController {
  subControllers = [
    controller("/auth", AuthController),
    controller("/elections", ElectionController)
  ];

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
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}
