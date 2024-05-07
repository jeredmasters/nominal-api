import { IVoterTag, IUnsavedVoterTag, VoterTagEntity } from "./voter_tag.entity";
import { BaseRepo } from "../base-repo";

export class VoterTagRepository extends BaseRepo<VoterTagEntity, IVoterTag, IUnsavedVoterTag> {
  constructor() {
    super(VoterTagEntity, "vt")
  }
}
