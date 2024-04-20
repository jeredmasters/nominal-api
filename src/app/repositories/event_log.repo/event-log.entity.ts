import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Voter } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base";
import { Election } from "../election.repo/election.entity";
import { EmailToken } from "../email-token.repo/email-token.entity";
import { Candidate } from "../candidate.repo/candidate.entity";
import { Organisation } from "../organisation.repo/organisation.entity";
import { ApiToken } from "../api-token.repo/api-token.entity";
import { Enrollment } from "../enrollment.repo/enrollment.entity";

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
export class EventLog extends BaseEntity implements IEventLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @Column()
  primary: EVENT_PRIMARY;

  @Column()
  trigger: string;

  @Column('jsonb', { nullable: true })
  meta: any;

  @ForeignKey(Voter, { nullable: true })
  voter_id?: string;

  @ForeignKey(Election, { nullable: true })
  election_id?: string;

  @ForeignKey(EmailToken, { nullable: true })
  email_token_id?: string;

  @ForeignKey(Candidate, { nullable: true })
  candidate_id?: string;

  @ForeignKey(Organisation, { nullable: true })
  organisation_id?: string;

  @ForeignKey(ApiToken, { nullable: true })
  api_token_id?: string;

  @ForeignKey(Enrollment, { nullable: true })
  enrollment_id?: string;

  @ForeignKey(Response, { nullable: true })
  response_id?: string;
}
