import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { ElectionEntity } from "../election.repo/election.entity";
import { CandidateEntity } from "../candidate.repo/candidate.entity";

export interface IRunning extends IUnsavedRunning {
  id: string;
  created_at: Date;
}

export interface IUnsavedRunning {
  candidate_id: string
  election_id: string
}

@Entity("runnings")
@Unique(["candidate_id", "election_id"])
export class RunningEntity extends BaseEntity implements IRunning {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(CandidateEntity)
  candidate_id: string

  @ForeignKey(ElectionEntity)
  election_id: string
}
