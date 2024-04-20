import { HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseInternalServerError, HttpResponseNotFound, HttpResponseUnauthorized } from "@foal/core";
import { ERROR_TYPE, InternalError } from "../domain/error";

export const ErrorToResponse = (err: InternalError | Error): HttpResponse => {
    console.error(err);
    console.error(JSON.stringify(err))
    if ("type" in err) {
        switch (err.type) {
            case ERROR_TYPE.BAD_INPUT:
                return new HttpResponseBadRequest(err);
            case ERROR_TYPE.NOT_ALLOWED:
                return new HttpResponseForbidden(err);
            case ERROR_TYPE.NOT_FOUND:
                return new HttpResponseNotFound(err);
            case ERROR_TYPE.UNKOWN:
            default:
                return new HttpResponseInternalServerError(err)
        }
    }
    return new HttpResponseInternalServerError(new InternalError({
        code: "unknown_error",
        func: "",
        type: ERROR_TYPE.UNKOWN,
        inner: err
    }));
}