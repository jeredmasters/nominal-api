import { Context, Get, Hook, HttpResponseNoContent, HttpResponseOK, Options, controller } from "@foal/core";
import { AdminController } from "./admin";
import { ConsumerController } from "./consumer";

@Hook((ctx) => (response) => {
    response.setHeader(
        "Access-Control-Allow-Origin",
        ctx.request.get("Origin") || "*"
    );
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Total-Count");
    response.setHeader("Access-Control-Expose-Headers", "Content-Type,Authorization,X-Total-Count");
})
export class ApiController {
    subControllers = [
        controller("/a", AdminController),
        controller("/c", ConsumerController),
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

        return response;
    }
}