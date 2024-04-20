import { ObjectLiteral } from "typeorm";

export type UnsavedModel<T> = Omit<T, "id" | "created_at"> & {
  id?: string;
  created_at?: Date;
};


export interface RepoResult<T = any> {
  source: string,
  results: T,
  query: string,
  params: ObjectLiteral
}


export type RepoPromise<T = any> = Promise<RepoResult<T>>
