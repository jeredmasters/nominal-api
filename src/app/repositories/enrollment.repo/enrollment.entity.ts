import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { ElectionEntity } from "../election.repo/election.entity";

export interface IEnrollment extends IUnsavedEnrollment {
  id: string;
  created_at: Date;
}

export interface IUnsavedEnrollment {
  voter_id: string
  election_id: string
}

@Entity("enrollments")
export class EnrollmentEntity extends BaseEntity implements IEnrollment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(VoterEntity)
  voter_id: string

  @ForeignKey(ElectionEntity)
  election_id: string
}
