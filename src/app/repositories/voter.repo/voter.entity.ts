
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterDigestEntity } from "../voter_digest.repo/voter_digest.entity";
import { BaseEntity2 } from "../base-entity";

export enum VOTER_STATUS {
  INACTIVE = "INACTIVE",
  VIEWED = "VIEWED",
  PARTIAL_SUBMIT = "PARTIAL_SUBMIT",
  SUBMITTED = "SUBMITTED"
}

export interface IVoter extends IUnsavedVoter {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoter extends IBaseUnsaved {
  election_id: string;
  voter_digest_id?: string;
  title?: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  email: string;
  status: VOTER_STATUS;
}

@Entity("voters")
export class VoterEntity extends BaseEntity2 implements IVoter {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @ForeignKey(VoterDigestEntity, { nullable: true })
  voter_digest_id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  preferred_name?: string;

  @Column()
  email: string;

  @Column()
  status: VOTER_STATUS;
}
