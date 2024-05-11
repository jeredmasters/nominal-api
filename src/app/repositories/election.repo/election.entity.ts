import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base-repo";

export enum ELECTION_STATUS {
  DRAFT = "DRAFT",
  NOMINATIONS = "NOMINATIONS",
  RUNNING = "RUNNING",
  COMPLETE = "COMPLETE",
  CANCELLED = "CANCELLED"
}

export enum ELECTION_MODE {
  SCHEDULE = "SCHEDULE",
  MANUAL = "MANUAL",
}


export interface IElection extends IUnsavedElection {
  id: string;
  created_at: Date;
}

export interface IUnsavedElection extends IBaseUnsaved {
  organisation_id: string;
  label: string;
  opens_at: Date;
  closes_at: Date;
  status: ELECTION_STATUS;
  short_description?: string;
  mode: ELECTION_MODE;
}

@Entity("elections")
export class ElectionEntity extends BaseEntity implements IElection {
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

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column()
  status: ELECTION_STATUS;

  @Column()
  mode: ELECTION_MODE;

  @Column()
  closes_at: Date;

  @Column()
  opens_at: Date;

}
