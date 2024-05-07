import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";

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

export interface IAdminPermission extends IUnsavedAdminPermission {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminPermission extends IBaseUnsaved {
  admin_user_id: string;
  entity: string;
  action: string;
  target_organisation_id?: string;
}

@Entity("admin_permissions")
export class AdminPermissionEntity extends BaseEntity implements IAdminPermission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(AdminUserEntity)
  admin_user_id: string;

  @Column()
  entity: string;

  @Column()
  action: string;

  @ForeignKey(OrganisationEntity, { nullable: true })
  target_organisation_id?: string;
}
