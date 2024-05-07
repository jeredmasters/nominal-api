import { VoterDigestEntity, IVoterDigest, IUnsavedVoterDigest } from "./voter_digest.entity";
import { BaseRepo } from "../base-repo";

export class VoterDigestRepository extends BaseRepo<VoterDigestEntity, IVoterDigest, IUnsavedVoterDigest> {
  constructor() {
    super(VoterDigestEntity, "fu");
  }
}
