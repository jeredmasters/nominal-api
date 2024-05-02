import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { CandidateEntity } from "../candidate.repo/candidate.entity";
import { BallotEntity } from "../ballot.repo/ballot.entity";

export interface IRunning extends IUnsavedRunning {
  id: string;
  created_at: Date;
}

export interface IUnsavedRunning {
  candidate_id: string
  ballot_id: string
}

@Entity("runnings")
@Unique(["candidate_id", "ballot_id"])
export class RunningEntity extends BaseEntity implements IRunning {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(CandidateEntity)
  candidate_id: string

  @ForeignKey(BallotEntity)
  ballot_id: string
}
