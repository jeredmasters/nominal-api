
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base-repo";
import { BallotEntity } from "../ballot.repo/ballot.entity";
import { VoterEntity } from "../voter.repo/voter.entity";
import { BaseEntity2 } from "../base-entity";

export interface IResponse extends IUnsavedResponse {
  id: string;
  created_at: Date;
}

export interface IUnsavedResponse extends IBaseUnsaved {
  voter_id: string;
  ballot_id: string;
  value: any
}

@Entity("responses")
export class ResponseEntity extends BaseEntity2 implements IResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(VoterEntity)
  voter_id: string;

  @ForeignKey(BallotEntity)
  ballot_id: string;

  @Column({ select: false, type: "jsonb" })
  value: string;
}
