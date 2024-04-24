import { Context, Get, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseInternalServerError, HttpResponseNotFound, HttpResponseOK, HttpResponseUnauthorized, Post } from "@foal/core";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { In, ObjectLiteral, ObjectType, SelectQueryBuilder } from "typeorm";

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
export interface RestQueryC { id: Array<string> }

export type RestQuery = RestQueryA | RestQueryB | RestQueryC

export const applyRestQuery = async <T extends ObjectLiteral>(entity: T, restQuery?: RestQuery): Promise<HttpResponse> => {
    const queryBuilder: SelectQueryBuilder<T> = entity.createQueryBuilder();
    let pageSize: number | null = null;

    if (restQuery) {
        if ("id" in restQuery) {
            console.log("Query type C")

            const id = restQuery['id'];
            if (Array.isArray(id)) {
                queryBuilder.andWhere({ "id": In(id) });
            } else {
                queryBuilder.andWhere({ "id": id });
            }
        }
        if ("_start" in restQuery) {
            console.log("Query type b")

            const { _sort, _order, _start, _end } = restQuery;
            const filterFields = Object.keys(restQuery).filter(f => !f.startsWith("_"))
            console.log({ filterFields })

            if (filterFields.length > 0) {
                for (const field of filterFields) {
                    queryBuilder.andWhere({ [field]: restQuery[field] });
                }
                if (filterFields.includes('id')) {
                    console.log(queryBuilder.getSql(), queryBuilder.getParameters())
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
        response.setHeader("Content-Range", `measurements 0-20/${count}`);
        response.setHeader("X-Total-Count", Math.ceil(count).toString());

        if (pageSize) {
            response.setHeader("X-Total-Pages", Math.ceil(count / pageSize).toString());
            response.setHeader("X-Per-Page", Math.ceil(pageSize).toString());
        }
        return response;
    }
    catch (err) {
        console.error(err);
        console.log(queryBuilder.getSql(), queryBuilder.getParameters())
        return new HttpResponseInternalServerError(err)
    }
}


export const fetchOne = async <T extends ObjectLiteral>(entity: T, id: string, restQuery?: RestQuery): Promise<HttpResponse> => {
    const queryBuilder: SelectQueryBuilder<T> = entity.createQueryBuilder();

    const value = await queryBuilder.where('id = :id', { id }).getOne();

    if (value) {
        return new HttpResponseOK(value);
    }
    return new HttpResponseNotFound(new InternalError({
        code: `${entity}_not_found`,
        func: "fetchOne",
        type: ERROR_TYPE.NOT_FOUND,
        context: id
    }))
}


export class AdminBaseController<T = ObjectLiteral> {
    entity: ObjectLiteral
    alias: string;

    constructor(entity: ObjectLiteral, alias: string = "base") {
        this.entity = entity;
        this.alias = alias;
    }

    applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
        console.log("DEFAULT FILTER", field)
        queryBuilder.andWhere({ [field]: value });
    }

    @Get('')
    async index(ctx: Context) {
        try {
            const query = ctx.request.query;
            console.log({ query })
            const queryBuilder: SelectQueryBuilder<ObjectLiteral> = this.entity.createQueryBuilder(this.alias);
            queryBuilder.select(`${this.alias}.*`);
            let pageSize: number | null = null;

            if (query) {
                if ("id" in query) {
                    console.log("Query type C")

                    const id = query['id'];
                    if (Array.isArray(id)) {
                        queryBuilder.andWhere({ "id": In(id) });
                    } else {
                        queryBuilder.andWhere({ "id": id });
                    }
                }
                if ("_start" in query) {
                    console.log("Query type b")

                    const { _sort, _order, _start, _end } = query;
                    const filterFields = Object.keys(query).filter(f => !f.startsWith("_"))
                    console.log({ filterFields })

                    if (filterFields.length > 0) {
                        for (const field of filterFields) {
                            this.applyFilter(queryBuilder, field, query[field]);
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
                else if ("range" in query) {

                    const { filter, range, sort } = query;
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
                console.log(queryBuilder.getSql(), queryBuilder.getParameters())
                const items = await queryBuilder.getRawMany()
                const count = await queryBuilder.getCount()

                console.log(items, count)

                const response = new HttpResponseOK(items);
                response.setHeader("Content-Range", `measurements 0-20/${count}`);
                response.setHeader("X-Total-Count", Math.ceil(count).toString());

                if (pageSize) {
                    response.setHeader("X-Total-Pages", Math.ceil(count / pageSize).toString());
                    response.setHeader("X-Per-Page", Math.ceil(pageSize).toString());
                }
                return response;
            }
            catch (err) {
                console.error(err);
                console.log(queryBuilder.getSql(), queryBuilder.getParameters())
                return new HttpResponseInternalServerError(err)
            }

        }
        catch (err) {
            return errorToResponse(err)
        }
    }

    @Get('/:id')
    async getOne({ request }: Context) {
        try {
            const { id } = request.params;
            return fetchOne(this.entity, id)
        }
        catch (err) {
            return errorToResponse(err)
        }
    }

    @Post('')
    async postCreate({ request }: Context) {
        try {
            const { body } = request;
            const prepared = await this.beforeCreate(body)
            const item = await this.entity.save(prepared);
            const modified = await this.afterCreate(prepared, item);
            return new HttpResponseOK(modified);
        }
        catch (err) {
            return errorToResponse(err)
        }
    }

    async beforeCreate(raw: any) {
        return raw;
    }

    async afterCreate(raw: any, item: T) {
        return item;
    }
}
