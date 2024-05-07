import { VoterEntity, IVoter, IUnsavedVoter } from "./voter.entity";
import { BaseRepo } from "../base-repo";


export class VoterRepository extends BaseRepo<VoterEntity, IVoter, IUnsavedVoter> {
  constructor() {
    super(VoterEntity, "v")
  }
}