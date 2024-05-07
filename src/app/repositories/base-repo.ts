import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { ERROR_TYPE, InternalError } from "../domain/error";

export interface IBaseUnsaved {
    id?: string;
    created_at?: Date;
}

export type ISaved<T = IBaseUnsaved> = {
    id: string;
    created_at: Date;
} & T;


export class BaseRepo<TEntity extends ObjectLiteral, TSaved extends ISaved, TUnsaved extends IBaseUnsaved> {
    entity: ObjectLiteral;
    alias: string;

    constructor(entity: ObjectLiteral, alias: string = "base") {
        this.entity = entity;
        this.alias = alias;
    }

    getAll(): Promise<Array<TSaved>> {
        return this.entity.find();
    }
    getById(id: string): Promise<TSaved | null> {
        return this.entity.findOneBy({ id })
    }
    async getByIdOrThrow(id: string): Promise<TSaved> {
        const account = await this.getById(id);
        if (!account) {
            throw new InternalError({
                code: `${this.alias}_id_not_found`,
                func: "getByIdOrThrow",
                context: id,
                meta: { id },
                type: ERROR_TYPE.NOT_FOUND
            });
        }
        return account;
    }

    async save(unsaved: TUnsaved): Promise<TSaved> {
        return this.entity.save(unsaved as any);
    }

    createQueryBuilder(): SelectQueryBuilder<TEntity> {
        return this.entity.createQueryBuilder(this.alias);
    }

}