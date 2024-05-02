import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base";
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

  @ForeignKey(BallotEntity, { nullable: true })
  copy_ballot_id?: string;

  @Column()
  label: string;

  @Column()
  response_type: RESPONSE_TYPE;
}
