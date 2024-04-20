export interface IBaseUnsaved {
    id?: string;
    created_at?: Date;
}

export type ISaved<T = IBaseUnsaved> = {
    id: string;
    created_at: Date;
} & T;
