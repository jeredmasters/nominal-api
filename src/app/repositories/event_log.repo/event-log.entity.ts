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

export enum EVENT_PRIMARY {
  DEBUG = "DEBUG",
  OPEN_EMAIL_TOKEN = 'OPEN_EMAIL_TOKEN',
  NEW_REPONSE = 'NEW_REPONSE',
  UPDATE_RESPONSE = "UPDATE_RESPONSE"
}

export interface IEventLog extends IUnsavedEventLog {
  id: string;
  created_at: Date;
}

export interface IUnsavedEventLog extends IBaseUnsaved {
  primary: EVENT_PRIMARY;
  trigger?: string;
  meta?: any;
  voter_id?: string;
  election_id?: string;
  email_token_id?: string;
  candidate_id?: string;
  organisation_id?: string;
  api_token_id?: string;
  enrollment_id?: string;
  response_id?: string;
}

@Entity("event_log")
export class EventLogEntity extends BaseEntity implements IEventLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  primary: EVENT_PRIMARY;

  @Column({ nullable: true })
  trigger?: string;

  @Column('jsonb', { nullable: true })
  meta: any;

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
