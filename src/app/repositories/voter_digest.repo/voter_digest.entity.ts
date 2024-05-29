
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { ElectionEntity } from "../election.repo/election.entity";
import { FileUploadEntity } from "../file_upload.repo/file_upload.entity";
import { BaseEntity2 } from "../base-entity";
import { IBaseTag } from "../../domain/voter";

interface DigestColumn {
  index: number;
  label: string;
  target: string;
}

export enum VOTER_DIGEST_STATUS {
  UNPROCESSED = "UNPROCESSED",
  DELIMITED = "DELIMITED",
  CONFIGURED = "CONFIGURED",
  INGESTED = "INGESTED"
}

export interface IVoterDigest extends IUnsavedVoterDigest {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoterDigest extends IBaseUnsaved {
  election_id: string;
  file_upload_id: string;
  delimiter: string;
  status: VOTER_DIGEST_STATUS;
  first_row_is_headers: boolean;
  columns?: Array<DigestColumn>;
  headers?: Array<string>;
  row_count?: number;
  set_tags?: Array<{ key: string, value: string }>;
}

@Entity("voter_digest")
export class VoterDigestEntity extends BaseEntity2 implements IVoterDigest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(FileUploadEntity)
  file_upload_id: string;

  @ForeignKey(ElectionEntity)
  election_id: string;

  @Column()
  first_row_is_headers: boolean;

  @Column()
  delimiter: string;

  @Column()
  status: VOTER_DIGEST_STATUS;

  @Column({ type: "jsonb", nullable: true })
  columns?: Array<DigestColumn>;

  @Column({ type: "jsonb", nullable: true })
  headers?: Array<string>;

  @Column({ type: "int", nullable: true })
  row_count?: number;

  @Column({ type: "jsonb", nullable: true })
  set_tags?: Array<IBaseTag>;

}
