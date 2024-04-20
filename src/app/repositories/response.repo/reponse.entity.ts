
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Organisation } from "../organisation.repo/organisation.entity";

export interface IResponse extends IUnsavedResponse {
  id: string;
  created_at: Date;
}

export interface IUnsavedResponse {
  voter_id: string;
  election_id: string;
  response: any
}

@Entity("responses")
export class Response extends BaseEntity implements IResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(Organisation)
  voter_id: string;

  @ForeignKey(Organisation)
  election_id: string;

  @Column()
  response: string;
}
