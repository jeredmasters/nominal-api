export interface QueryOptions {
    limit?: number;
    orderBy?: { [col: string]: 'ASC' | 'DESC' }
}