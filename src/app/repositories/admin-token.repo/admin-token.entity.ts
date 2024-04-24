import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";

export interface IAdminToken extends IUnsavedAdminToken {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminToken extends IBaseUnsaved {
  public_key: string;
  secret_key: string;
  admin_user_id: string;
  client_ip?: string;
  client_user_agent?: string;
  device_meta?: any;
}

@Entity("admin_tokens")
export class AdminTokenEntity extends BaseEntity implements IAdminToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(AdminUserEntity)
  admin_user_id: string;

  @Column()
  public_key: string;

  @Column()
  secret_key: string;

  @Column({ nullable: true })
  client_ip?: string;

  @Column({ nullable: true })
  client_user_agent?: string;

  @Column('jsonb', { nullable: true })
  device_meta?: any;
}
