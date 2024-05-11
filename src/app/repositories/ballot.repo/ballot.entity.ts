import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { RESPONSE_TYPE } from "../../const/election";
import { ElectionEntity } from "../election.repo/election.entity";

export interface IBallot extends IUnsavedBallot {
  id: string;
  created_at: Date;
}

export interface IUnsavedBallot extends IBaseUnsaved {
  election_id: string;
  copy_ballot_id?: string;
  label: string;
  response_type: RESPONSE_TYPE;
  short_description?: string;
  condition?: BallotCondition;
}

export enum CONDITION_TYPE {
  TAG_EQUALS = 'TAG_EQUALS'
}
export type BallotCondition = BallotCondition_Tag;
export interface BallotCondition_Tag {
  type: CONDITION_TYPE.TAG_EQUALS,
  key: string;
  value: string;
}

@Entity("ballots")
export class BallotEntity extends BaseEntity implements IBallot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @Column()
  label: string;

  @Column()
  response_type: RESPONSE_TYPE;

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column({ type: 'jsonb', nullable: true })
  condition?: BallotCondition;
}
