
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";

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
export class ResponseEntity extends BaseEntity implements IResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(OrganisationEntity)
  voter_id: string;

  @ForeignKey(OrganisationEntity)
  election_id: string;

  @Column()
  response: string;
}
