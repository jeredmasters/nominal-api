
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { IBaseUnsaved } from "../base-repo";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";

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
  organisation_id: string;
}

@Entity("candidates")
export class CandidateEntity extends BaseEntity implements ICandidate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(OrganisationEntity)
  organisation_id: string;

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
