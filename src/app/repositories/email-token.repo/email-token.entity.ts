import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";
import { ElectionEntity } from "../election.repo/election.entity";

export enum EMAIL_TOKEN_ACTION {
  LOGIN = "LOGIN",
  SINGLE_VOTE = "SINGLE_VOTE"
}

export enum EMAIL_TOKEN_STATUS {
  UNUSED = "UNUSED",
  OPENED = "OPENED",
  VOTED = 'VOTED',
  EXPIRED = "EXPIRED",
  DISABLED = "DISABLED"
}

export interface IEmailToken extends IUnsavedEmailToken {
  id: string;
  created_at: Date;
}

export interface IUnsavedEmailToken extends IBaseUnsaved {
  action: EMAIL_TOKEN_ACTION;
  status: EMAIL_TOKEN_STATUS;
  voter_id: string;
  election_id?: string;
  expires_at?: Date;
}

@Entity("email_tokens")
export class EmailTokenEntity extends BaseEntity implements IEmailToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(VoterEntity)
  voter_id: string;

  @ForeignKey(ElectionEntity, { nullable: true })
  election_id?: string;

  @Column()
  action: EMAIL_TOKEN_ACTION;

  @Column()
  status: EMAIL_TOKEN_STATUS;

  @Column({ nullable: true })
  expires_at?: Date;
}
