import { BaseEntity, CreateDateColumn, DeepPartial, PrimaryGeneratedColumn, SaveOptions, UpdateDateColumn } from "typeorm";
import { idGenerator } from "../util/uuid";

export interface IBaseUnsaved {
    id?: string;
    created_at?: Date;
}

export type ISaved<T extends IBaseUnsaved = IBaseUnsaved> = {
    id: string;
    created_at: Date;
} & T;


export class BaseEntity2<I extends ISaved = ISaved> extends BaseEntity implements ISaved {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    /**
 * Saves one or many given entities.
 */
    static save<T extends BaseEntity2>(
        this: { new(): T } & typeof BaseEntity2,
        entityOrEntities: DeepPartial<T> | DeepPartial<T>[],
        options?: SaveOptions,
    ) {
        if (Array.isArray(entityOrEntities)) {
            entityOrEntities = entityOrEntities.map(e => e.id ? e : { ...e, id: this.newId() })
        } else {
            if (!entityOrEntities.id) {
                entityOrEntities.id = this.newId();
            }
        }
        return this.getRepository<T>().save(entityOrEntities as any, options)
    }

    static newId(): string {
        const repository = this.getRepository();
        const tablename = repository.metadata.tableName;
        return idGenerator.getNewUUID(tablename);
    }
}