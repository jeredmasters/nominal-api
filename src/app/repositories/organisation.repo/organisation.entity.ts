import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IBaseUnsaved } from "../base";

export interface IOrganisation extends IUnsavedOrganisation {
  id: string;
  created_at: Date;
}

export interface IUnsavedOrganisation extends IBaseUnsaved {
  label: string;
  logo_sm_url?: string;
  logo_lg_url?: string;
  theme_highlight?: string;
}

@Entity("organisations")
export class OrganisationEntity extends BaseEntity implements IOrganisation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  label: string;

  @Column({ nullable: true })
  logo_sm_url?: string;

  @Column({ nullable: true })
  logo_lg_url?: string;

}
