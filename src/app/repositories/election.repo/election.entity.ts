import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base";
import { ELECTION_TYPE } from "../../const/election";

export interface IElection extends IUnsavedElection {
  id: string;
  created_at: Date;
}

export interface IUnsavedElection extends IBaseUnsaved {
  organisation_id: string;
  label: string;
  type: ELECTION_TYPE;
}

@Entity("elections")
export class ElectionEntity extends BaseEntity implements IElection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(OrganisationEntity)
  organisation_id: string;

  @Column()
  label: string;

  @Column()
  type: ELECTION_TYPE;
}
