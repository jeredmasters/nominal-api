import { DataSource, ObjectLiteral, Repository, SelectQueryBuilder, getRepository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { dependency } from "@foal/core";
import { IdGenerator } from "../util/uuid";
import { BaseEntity2 } from "./base-entity";

export interface IBaseUnsaved {
    id?: string;
    created_at?: Date;
}

export type ISaved<T = IBaseUnsaved> = {
    id: string;
    created_at: Date;
} & T;

export class BaseRepo<TEntity extends BaseEntity2 & TSaved, TSaved extends ISaved, TUnsaved extends IBaseUnsaved> {
    entity: ObjectLiteral;
    alias: string;

    @dependency
    dataSource: DataSource;

    @dependency
    idGenerator: IdGenerator;

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
                code: `${this.tablename()}_id_not_found`,
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

    async update(id: string, unsaved: Partial<TUnsaved>): Promise<TSaved> {
        return this.entity.update(id, unsaved as any);
    }

    createQueryBuilder(): SelectQueryBuilder<TEntity> {
        return this.entity.createQueryBuilder(this.alias);
    }

    getRepository(): Repository<ObjectLiteral> {
        return this.dataSource.getRepository(this.entity as any);
    }

    newId(): string {
        return this.idGenerator.getNewUUID(this.tablename());
    }

    tablename() {
        const repository = this.getRepository();
        return repository.metadata.tableName;
    }
}