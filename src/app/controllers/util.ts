import { HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseInternalServerError, HttpResponseNotFound, HttpResponseOK, HttpResponseUnauthorized } from "@foal/core";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export const errorToResponse = (err: InternalError | Error | unknown): HttpResponse => {
    console.error(err);
    console.error(JSON.stringify(err))
    if (err && typeof err == "object" && err instanceof InternalError) {
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

export interface RestQueryA { filter: '{}', range: '[30,39]', sort: '["id","ASC"]' }
export interface RestQueryB { _end: '10', _order: 'ASC', _sort: 'id', _start: '0', _filter: "" }
export type RestQuery = RestQueryA | RestQueryB
export const applyRestQuery = async <T extends ObjectLiteral>(entity: T, restQuery?: RestQuery): Promise<HttpResponse> => {
    const queryBuilder: SelectQueryBuilder<T> = entity.createQueryBuilder();
    let type: "A" | "B" | null = null;
    let pageSize: number | null = null;

    if (restQuery) {
        if ("_start" in restQuery) {
            type = "A";

            const { _filter, _sort, _order, _start, _end } = restQuery;
            if (_filter) {
                const parsed = JSON.parse(_filter);
                console.log({ _filter, parsed })
                for (const key of Object.keys(parsed)) {
                    queryBuilder.andWhere({ [key]: parsed[key] });
                }
            }
            if (_start) {
                queryBuilder.offset(Number(_start));
                if (_end) {
                    pageSize = Number(_end) - Number(_start);
                    queryBuilder.limit(pageSize);
                }
            }
            if (_order && _sort) {
                queryBuilder.orderBy(_sort, _order);
            }
        }
        else if ("range" in restQuery) {
            type = "B";

            const { filter, range, sort } = restQuery;
            if (filter) {
                const parsed = JSON.parse(filter);
                console.log({ filter, parsed })
                for (const key of Object.keys(parsed)) {
                    queryBuilder.andWhere({ [key]: parsed[key] });
                }
            }
            if (range) {
                const [from, to] = JSON.parse(range);
                pageSize = to - from;
                queryBuilder.limit(pageSize);
                queryBuilder.offset(from);
            }
            if (sort) {
                const [column, direction] = JSON.parse(sort);
                queryBuilder.orderBy(column, direction);
            }
        }
    }
    else {
        queryBuilder.limit(100)
    }

    try {
        const [items, count] = await queryBuilder.getManyAndCount();

        const response = new HttpResponseOK(items);
        response.setHeader("Content-Range", `measurements 0-20/${count}`)
        if (pageSize) {
            response.setHeader("X-Total-Count", Math.ceil(count / pageSize).toString())
        }
        return response;
    }
    catch (err) {
        console.error(err);
        console.log(queryBuilder.getSql(), queryBuilder.getParameters())
        return new HttpResponseInternalServerError(err)
    }
}