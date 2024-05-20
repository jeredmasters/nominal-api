import { Column, ColumnType, JoinColumn, ManyToOne, ObjectType, RelationOptions } from "typeorm";

export interface ForeignKeyOptions extends RelationOptions {
    nullable?: boolean;
    targetCol?: string;
    type?: ColumnType;
}

export function ForeignKey<T = unknown>(entity: ObjectType<T> | string, options?: ForeignKeyOptions): PropertyDecorator {
    return function (object, propertyName) {

        const f1 = typeof entity === "string" ? ManyToOne(entity, options) : ManyToOne(() => entity, options);
        const f2 = JoinColumn({ name: propertyName.toString() });
        const f3 = Column({ type: options?.type, ...options });

        f1(object, propertyName);
        f2(object, propertyName);
        f3(object, propertyName);
    }
}
