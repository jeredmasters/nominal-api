
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { Organisation } from "../organisation.repo/organisation.entity";
import { IBaseUnsaved } from "../base";

export interface IVoter extends IUnsavedVoter {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoter extends IBaseUnsaved {
  organisation_id: string;
  first_name: string;
  last_name: string;
}

@Entity("voters")
export class Voter extends BaseEntity implements IVoter {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @ForeignKey(Organisation)
  organisation_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;
}
