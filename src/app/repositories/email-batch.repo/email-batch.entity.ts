import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterCondition } from "../ballot.repo/ballot.entity";


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

export interface IEmailBatch extends IUnsavedEmailBatch {
  id: string;
  created_at: Date;
}

export interface IUnsavedEmailBatch extends IBaseUnsaved {
  voter_ids: Array<string>;
  election_id: string;
  send_at?: Date;
  status: EMAIL_BATCH_STATUS;
}

@Entity("email_batches")
export class EmailBatchEntity extends BaseEntity implements IEmailBatch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  voter_ids: Array<string>;

  @ForeignKey(ElectionEntity, { nullable: true })
  election_id: string;

  @Column({ nullable: true })
  send_at?: Date;

  @Column()
  status: EMAIL_BATCH_STATUS;

  @Column()
  schedule: EMAIL_SCHEDULE;

  @Column({ type: 'jsonb', nullable: true })
  condition?: VoterCondition;
}
