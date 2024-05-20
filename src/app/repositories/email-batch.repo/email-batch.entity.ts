import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterFilterEntity } from "../voter-filter.repo/voter-filter.entity";
import { BaseEntity2 } from "../base-entity";


export enum EMAIL_BATCH_STATUS {
  DRAFT = 'DRAFT',
  ENABLED = 'ENABLED',
  SENDING = 'SENDING',
  SENT = 'SENT'
}

export enum EMAIL_SCHEDULE {
  SEND_NOW = 'SEND_NOW',
  SEND_LATER = 'SEND_LATER'
}

export interface IEmailBatch extends IUnsavedEmailBatch {
  id: string;
  created_at: Date;
}

export interface IUnsavedEmailBatch extends IBaseUnsaved {
  election_id: string;
  send_at?: Date;
  status: EMAIL_BATCH_STATUS;
}

@Entity("email_batches")
export class EmailBatchEntity extends BaseEntity2 implements IEmailBatch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity, { nullable: true })
  election_id: string;

  @ForeignKey(VoterFilterEntity, { nullable: true })
  voter_filter_id?: string;

  @Column({ nullable: true })
  send_at?: Date;

  @Column()
  status: EMAIL_BATCH_STATUS;

  @Column()
  schedule: EMAIL_SCHEDULE;

  @Column()
  schedule_status: EMAIL_SCHEDULE;
}
