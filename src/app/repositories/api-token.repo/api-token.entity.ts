import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Voter } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";
import { EmailToken } from "../email-token.repo/email-token.entity";

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

export interface IApiToken extends IUnsavedApiToken {
  id: string;
  created_at: Date;
}

export interface IUnsavedApiToken extends IBaseUnsaved {
  public_key: string;
  secret_key: string;
  voter_id: string;
  email_token_id?: string;
  client_ip?: string;
  client_user_agent?: string;
}

@Entity("api_tokens")
export class ApiToken extends BaseEntity implements IApiToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(Voter)
  voter_id: string;

  @ForeignKey(EmailToken, { nullable: true })
  email_token_id?: string;

  @Column()
  public_key: string;

  @Column()
  secret_key: string;

  @Column({ nullable: true })
  client_ip?: string;

  @Column({ nullable: true })
  client_user_agent?: string;

}
