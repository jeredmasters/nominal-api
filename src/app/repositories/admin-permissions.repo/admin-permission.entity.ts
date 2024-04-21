import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";

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
  permission: string;
}

@Entity("admin_permissions")
export class AdminPermissionEntity extends BaseEntity implements IAdminPermission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(AdminUserEntity)
  admin_user_id: string;

  @Column()
  permission: string;
}
