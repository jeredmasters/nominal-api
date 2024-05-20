
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { VoterEntity } from "../voter.repo/voter.entity";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { ElectionEntity } from "../election.repo/election.entity";
import { CandidateEntity } from "../candidate.repo/candidate.entity";
import { BaseEntity2 } from "../base-entity";

export interface IFileUpload extends IUnsavedFileUpload {
  id: string;
  created_at: Date;
}

export interface IUnsavedFileUpload extends IBaseUnsaved {
  organisation_id: string;
  election_id?: string;
  candidate_id?: string;
  purpose: string;
  original_filename: string;
  original_extension: string;
  store_path: string;
  columns?: Array<string>;
  row_count?: number;
}

@Entity("file_uploads")
export class FileUploadEntity extends BaseEntity2 implements IFileUpload {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(OrganisationEntity)
  organisation_id: string;

  @ForeignKey(ElectionEntity, { nullable: true })
  election_id?: string;

  @ForeignKey(CandidateEntity, { nullable: true })
  candidate_id?: string;

  @Column()
  purpose: string;

  @Column()
  original_filename: string;

  @Column()
  original_extension: string;

  @Column()
  store_path: string;

  @Column({ type: "jsonb", nullable: true })
  columns?: Array<string>;

  @Column({ type: "int", nullable: true })
  row_count?: number;
}
