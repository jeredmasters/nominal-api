import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Voter } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";

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
  expirest_at?: Date;
}

@Entity("email_tokens")
export class EmailToken extends BaseEntity implements IEmailToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(Voter)
  voter_id: string;

  @ForeignKey(Voter, { nullable: true })
  election_id?: string;

  @Column()
  action: EMAIL_TOKEN_ACTION;

  @Column()
  status: EMAIL_TOKEN_STATUS;

  @Column({ nullable: true })
  expirest_at?: Date;
}
