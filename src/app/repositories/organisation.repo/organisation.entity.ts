import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IBaseUnsaved } from "../base-repo";
import { BaseEntity2 } from "../base-entity";

export enum ORGANISATION_OWNER {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  GOVERMENT = "GOVERMENT"
}

export interface IOrganisation extends IUnsavedOrganisation {
  id: string;
  created_at: Date;
}

export interface IUnsavedOrganisation extends IBaseUnsaved {
  label: string;
  owner: ORGANISATION_OWNER;
  country: string;
  logo_sm_url?: string;
  logo_lg_url?: string;
  theme_highlight?: string;
}

@Entity("organisations")
export class OrganisationEntity extends BaseEntity2 implements IOrganisation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  label: string;

  @Column()
  owner: ORGANISATION_OWNER;

  @Column()
  country: string;

  @Column({ nullable: true })
  logo_sm_url?: string;

  @Column({ nullable: true })
  logo_lg_url?: string;

}
