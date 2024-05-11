
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { RunningEntity } from "../running.repo/running.entity";
import { CandidateEntity } from "../candidate.repo/candidate.entity";

export interface IProfile extends IUnsavedProfile {
  id: string;
  created_at: Date;
}


export enum PROFILE_STATUS {
  NEW = "NEW",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  APPROVED = "APPROVED",
  DEPRECATED = "DEPRECATED"
}


export interface IUnsavedProfile extends IBaseUnsaved {
  candidate_id: string;
  running_id?: string;
  version: number;
  preferred_name?: string;
  status: PROFILE_STATUS;
  rejected_reason?: string;
  statement?: string;
  learn_more_url?: string;
  image_sm_url?: string;
  image_lg_url?: string;
}

@Entity("profiles")
export class ProfileEntity extends BaseEntity implements IProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(CandidateEntity)
  candidate_id: string;

  @ForeignKey(RunningEntity, { nullable: true })
  running_id?: string;

  @Column()
  version: number;

  @Column({ nullable: true })
  preferred_name?: string;

  @Column()
  status: PROFILE_STATUS;

  @Column({ type: 'text', nullable: true })
  statement?: string;

  @Column({ nullable: true })
  rejected_reason?: string;

  @Column({ nullable: true })
  learn_more_url?: string;

  @Column({ nullable: true })
  image_sm_url?: string;

  @Column({ nullable: true })
  image_lg_url?: string;
}
