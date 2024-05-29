
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ForeignKey } from "../../util/foreign-key";
import { VoterEntity } from "../voter.repo/voter.entity";
import { IBaseUnsaved } from "../base-repo";
import { BaseEntity2 } from "../base-entity";
import { IBaseTag } from "../../domain/voter";



export interface IVoterTag extends IUnsavedVoterTag {
  id: string;
  created_at: Date;
}

export interface IUnsavedVoterTag extends IBaseUnsaved, IBaseTag {
  voter_id: string;
}

@Entity("voter_tags")
export class VoterTagEntity extends BaseEntity2 implements IVoterTag {
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
