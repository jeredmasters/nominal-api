import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IBaseUnsaved } from "../base-repo";
import { BaseEntity2 } from "../base-entity";

export enum ADMIN_ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  OPS = "OPS",
  ORGANISATION = "ORGANISATION",
}

export interface IAdminUser extends IUnsavedAdminUser {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminUser extends IBaseUnsaved {
  first_name: string;
  last_name: string;
  email: string;
  role: ADMIN_ROLE;
}

@Entity("admin_users")
export class AdminUserEntity extends BaseEntity2 implements IAdminUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  role: ADMIN_ROLE;
}
