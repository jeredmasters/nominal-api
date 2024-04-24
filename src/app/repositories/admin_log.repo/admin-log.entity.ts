import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";
import { ElectionEntity } from "../election.repo/election.entity";
import { EmailTokenEntity } from "../email-token.repo/email-token.entity";
import { CandidateEntity } from "../candidate.repo/candidate.entity";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { ApiTokenEntity } from "../api-token.repo/api-token.entity";
import { EnrollmentEntity } from "../enrollment.repo/enrollment.entity";
import { ResponseEntity } from "../response.repo/reponse.entity";
import { AdminUserEntity } from "../admin-user.repo/admin-user.entity";
import { AdminPermissionEntity } from "../admin-permissions.repo/admin-permission.entity";

export enum ADMIN_EVENT {
  DEBUG = "DEBUG",
  ADMIN_LOGIN = 'ADMIN_LOGIN'
}

export interface IAdminLog extends IUnsavedAdminLog {
  id: string;
  created_at: Date;
}

export interface IUnsavedAdminLog extends IBaseUnsaved {
  primary: ADMIN_EVENT;
  trigger?: string;
  meta?: any;
  admin_user_id?: string;
  admin_permission_id?: string;
  voter_id?: string;
  election_id?: string;
  email_token_id?: string;
  candidate_id?: string;
  organisation_id?: string;
  api_token_id?: string;
  enrollment_id?: string;
  response_id?: string;
}

@Entity("admin_log")
export class AdminLogEntity extends BaseEntity implements IAdminLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  primary: ADMIN_EVENT;

  @Column({ nullable: true })
  trigger: string;

  @Column('jsonb', { nullable: true }) admin_user_idadmin_user_id

  @ForeignKey(AdminUserEntity, { nullable: true })
  admin_user_id?: string;

  @ForeignKey(AdminPermissionEntity, { nullable: true })
  admin_permission_id?: string;

  @ForeignKey(VoterEntity, { nullable: true })
  voter_id?: string;

  @ForeignKey(ElectionEntity, { nullable: true })
  election_id?: string;

  @ForeignKey(EmailTokenEntity, { nullable: true })
  email_token_id?: string;

  @ForeignKey(CandidateEntity, { nullable: true })
  candidate_id?: string;

  @ForeignKey(OrganisationEntity, { nullable: true })
  organisation_id?: string;

  @ForeignKey(ApiTokenEntity, { nullable: true })
  api_token_id?: string;

  @ForeignKey(EnrollmentEntity, { nullable: true })
  enrollment_id?: string;

  @ForeignKey(ResponseEntity, { nullable: true })
  response_id?: string;
}
