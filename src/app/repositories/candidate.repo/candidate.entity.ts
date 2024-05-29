
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { BaseEntity2 } from "../base-entity";

export interface ICandidate extends IUnsavedCandidate {
  id: string;
  created_at: Date;
}

export enum CANDIDATE_STATUS {
  NOMINATED = "NOMINATED",
  VERIFIED = "VERIFIED",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface IUnsavedCandidate extends IBaseUnsaved {
  election_id: string;
  title?: string;
  first_name: string;
  last_name: string;
  email: string
  preferred_name?: string;
  status: CANDIDATE_STATUS;
}

@Entity("candidates")
export class CandidateEntity extends BaseEntity2 implements ICandidate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @ForeignKey("profiles", { nullable: true })
  profile_id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ type: 'int', nullable: true })
  sort_order: number;

  @Column({ nullable: true })
  preferred_name?: string;

  @Column()
  status: CANDIDATE_STATUS;

  @Column({ nullable: true })
  rejected_reason: string;
}
