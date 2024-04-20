
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Election } from "../election.repo/election.entity";
import { IBaseUnsaved } from "../base";

export interface ICandidate extends IUnsavedCandidate {
  id: string;
  created_at: Date;
}

export interface IUnsavedCandidate extends IBaseUnsaved {
  label: string;
  description?: string;
  learn_more_url?: string;
  image_sm_url?: string;
  image_lg_url?: string;
  election_id: string;
}

@Entity("candidates")
export class Candidate extends BaseEntity implements ICandidate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(Election)
  election_id: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  learn_more_url?: string;

  @Column({ nullable: true })
  image_sm_url?: string;

  @Column({ nullable: true })
  image_lg_url?: string;
}
