
import { CandidateEntity, ICandidate, IUnsavedCandidate } from "./candidate.entity";
import { BaseRepo } from "../base-repo";

export class CandidateRepository extends BaseRepo<CandidateEntity, ICandidate, IUnsavedCandidate> {
  constructor() {
    super(CandidateEntity, 'c')
  }
  async setProfile(candidate_id: string, profile_id: string) {
    return CandidateEntity.update(candidate_id, { profile_id });
  }
  getByElectionId(election_id: string) {
    return CandidateEntity.findBy({ election_id });
  }
}
