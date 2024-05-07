
import { ElectionEntity, IElection, IUnsavedElection } from "./election.entity";
import { BaseRepo } from "../base-repo";
import { VoterEntity } from "../voter.repo/voter.entity";

export class ElectionRepository extends BaseRepo<ElectionEntity, IElection, IUnsavedElection> {
  constructor() {
    super(ElectionEntity, "el")
  }

}
