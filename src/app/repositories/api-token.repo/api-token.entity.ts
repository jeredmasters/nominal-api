import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base-repo";
import { EmailTokenEntity } from "../email-token.repo/email-token.entity";

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
  device_meta?: any
}

@Entity("api_tokens")
export class ApiTokenEntity extends BaseEntity implements IApiToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(VoterEntity)
  voter_id: string;

  @ForeignKey(EmailTokenEntity, { nullable: true })
  email_token_id?: string;

  @Column()
  public_key: string;

  @Column()
  secret_key: string;

  @Column({ nullable: true })
  client_ip?: string;

  @Column({ nullable: true })
  client_user_agent?: string;

  // @Column('jsonb', { nullable: true })
  // device_meta?: string;
}
