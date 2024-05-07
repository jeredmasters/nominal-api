import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base-repo";

export interface IElection extends IUnsavedElection {
  id: string;
  created_at: Date;
}

export interface IUnsavedElection extends IBaseUnsaved {
  organisation_id: string;
  copy_election_id?: string;
  label: string;
  opens_at: Date;
  closes_at: Date;
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

  @ForeignKey(ElectionEntity, { nullable: true })
  copy_election_id?: string;

  @Column()
  label: string;

  @Column()
  closes_at: Date;

  @Column()
  opens_at: Date;

}
