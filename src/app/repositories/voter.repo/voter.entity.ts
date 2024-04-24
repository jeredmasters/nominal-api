
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { OrganisationEntity } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base";

export interface IVoter extends IUnsavedVoter {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoter extends IBaseUnsaved {
  organisation_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Entity("voters")
export class VoterEntity extends BaseEntity implements IVoter {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(OrganisationEntity)
  organisation_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;
}
