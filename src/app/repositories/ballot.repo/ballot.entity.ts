import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { RESPONSE_TYPE } from "../../const/election";
import { ElectionEntity } from "../election.repo/election.entity";
import { VoterFilterEntity } from "../voter-filter.repo/voter-filter.entity";
import { BaseEntity2 } from "../base-entity";

export interface IBallot extends IUnsavedBallot {
  id: string;
  created_at: Date;
}

export interface IUnsavedBallot extends IBaseUnsaved {
  election_id: string;
  voter_filter_id?: string;
  label: string;
  response_type: RESPONSE_TYPE;
  short_description?: string;
  shuffle_candidates: boolean;
  available_seats?: number;
  exclusive_set?: string;
  exclusive_priority?: number;
  silo_by_tag?: string;
  display_order?: number;
}


@Entity("ballots")
export class BallotEntity extends BaseEntity2 implements IBallot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @ForeignKey(VoterFilterEntity, { nullable: true })
  voter_filter_id?: string;

  @Column()
  label: string;

  @Column()
  response_type: RESPONSE_TYPE;

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column()
  shuffle_candidates: boolean;

  @Column({ type: 'int', nullable: true })
  min_ranking?: number;

  @Column({ type: 'int', nullable: true })
  max_ranking?: number;

  @Column({ type: 'int', nullable: true })
  available_seats?: number;

  @Column({ type: 'uuid', nullable: true })
  exclusive_set?: string;

  @Column({ type: 'int', nullable: true })
  exclusive_priority?: number;

  @Column({ nullable: true })
  silo_by_tag?: string;

  @Column({ type: 'int', nullable: true })
  display_order?: number;
}
