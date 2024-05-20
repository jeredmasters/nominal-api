import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterFilter } from "../../domain/voter-filter";
import { BaseEntity2 } from "../base-entity";


export enum EMAIL_BATCH_STATUS {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  SENT = 'SENT',
  SENDING = 'SENDING'
}

export enum EMAIL_SCHEDULE {
  SEND_NOW = 'SEND_NOW',
  SEND_LATER = 'SEND_LATER'
}

export interface IVoterFilter extends IUnsavedVoterFilter {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoterFilter extends IBaseUnsaved {
  election_id: string;
  ballot_id?: string;
  email_batch_id?: string;
  where: VoterFilter;
  voter_count: number;
  voter_ids?: Array<string>;
}

@Entity("voter_filters")
export class VoterFilterEntity extends BaseEntity2 implements IVoterFilter {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @ForeignKey("ballots", { nullable: true })
  ballot_id?: string;

  @ForeignKey("email_batches", { nullable: true })
  email_batch_id?: string;

  @Column({ type: 'jsonb' })
  where: VoterFilter;

  @Column()
  voter_count: number;

  @Column({ type: 'jsonb', nullable: true })
  voter_ids?: Array<string>;

  @Column({ nullable: true })
  evaluated_at?: Date;
}
