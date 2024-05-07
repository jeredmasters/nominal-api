
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base-repo";

export interface IVoterTag extends IUnsavedVoterTag {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoterTag extends IBaseUnsaved {
  voter_id: string;
  key: string;
  value: string;
}

@Entity("voter_tags")
export class VoterTagEntity extends BaseEntity implements IVoterTag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ForeignKey(VoterEntity)
  voter_id: string;

  @Column()
  key: string;

  @Column()
  value: string;
}
