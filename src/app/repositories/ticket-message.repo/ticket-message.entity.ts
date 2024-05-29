import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { RESPONSE_TYPE } from "../../const/election";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterFilterEntity } from "../voter-filter.repo/voter-filter.entity";
import { BaseEntity2 } from "../base-entity";
import { VoterEntity } from "../voter.repo/voter.entity";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";
import { FileUploadEntity } from "../file_upload.repo/file_upload.entity";
import { TicketEntity } from "../ticket.repo/ticket.entity";

export interface ITicketMessage extends IUnsavedTicketMessage {
  id: string;
  created_at: Date;
}

export interface IUnsavedTicketMessage extends IBaseUnsaved {
  ticket_id: string;
  admin_user_id?: string;
  content?: string;
  file_upload_id?: string;
}


@Entity("ticket_messages")
export class TicketMessageEntity extends BaseEntity2 implements ITicketMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(TicketEntity)
  ticket_id: string;

  @ForeignKey(AdminUserEntity, { nullable: true })
  admin_user_id?: string;

  @ForeignKey(FileUploadEntity, { nullable: true })
  file_upload_id?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;
}
