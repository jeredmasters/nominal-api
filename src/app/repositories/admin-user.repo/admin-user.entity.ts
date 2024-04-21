import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";
import { EmailTokenEntity } from "../email-token.repo/email-token.entity";

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

export interface IAdminUser extends IUnsavedAdminUser {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminUser extends IBaseUnsaved {
  name: string;
  email: string;

}

@Entity("admin_users")
export class AdminUserEntity extends BaseEntity implements IAdminUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @Column()
  name: string;

  @Column()
  email: string;
}
