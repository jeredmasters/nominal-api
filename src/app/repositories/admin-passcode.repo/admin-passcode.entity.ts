import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { IBaseUnsaved } from "../base";
import { ForeignKey } from "../../util/foreign-key";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";

export enum PASSCODE_TYPE {
  MFA = "MFA",
  PASSWORD = "PASSWORD"
}

export interface IAdminPasscode extends IUnsavedAdminPasscode {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminPasscode extends IBaseUnsaved {
  admin_user_id: string;
  type: PASSCODE_TYPE;
  value: string;
}

@Entity("admin_passcode")
export class AdminPasscode extends BaseEntity implements IAdminPasscode {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(AdminUserEntity)
  admin_user_id: string;

  @Column()
  type: PASSCODE_TYPE;

  @Column()
  value: string;
}
