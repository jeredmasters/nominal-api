import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { RESPONSE_TYPE } from "../../const/election";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterFilterEntity } from "../voter-filter.repo/voter-filter.entity";
import { BaseEntity2 } from "../base-entity";
import { VoterEntity } from "../voter.repo/voter.entity";
import { BallotEntity } from "../ballot.repo/ballot.entity";

export enum TICKET_REASON {
  UNRECOGNISED_VOTE = 'UNRECOGNISED_VOTE',
  CHANGE_VOTE = "CHANGE_VOTE",
  WRONG_PERSON = "WRONG_PERSON",
  INACCURTATE_INFORMATION = "INACCURTATE_INFORMATION",
  GENERAL_FEEDBACK = "GENERAL_FEEDBACK"
}

export interface ITicket extends IUnsavedTicket {
  id: string;
  created_at: Date;
}

export interface IUnsavedTicket extends IBaseUnsaved {
  election_id: string;
  voter_id: string;
  ballot_id?: string;
  reason: TICKET_REASON;
  voter_summary: string;
  voter_description: string;
  admin_summary: string;
  admin_description: string;
}

@Entity("tickets")
export class TicketEntity extends BaseEntity2 implements ITicket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @ForeignKey(VoterEntity, { nullable: true })
  voter_id: string;

  @ForeignKey(BallotEntity, { nullable: true })
  ballot_id?: string;

  @Column()
  reason: TICKET_REASON;

  @Column()
  voter_summary: string;

  @Column('text')
  voter_description: string;

  @Column()
  admin_summary: string;

  @Column('text')
  admin_description: string;
}
