import { VoterFilterEntity, IVoterFilter, IUnsavedVoterFilter } from "./voter-filter.entity";
import { BaseRepo } from "../base-repo";

export class VoterFilterRepository extends BaseRepo<VoterFilterEntity, IVoterFilter, IUnsavedVoterFilter> {
  constructor() {
    super(VoterFilterEntity, 'c');
  }

  updateBallotId(voter_filter_id: string, ballot_id: string) {
    return this.getRepository().update(voter_filter_id, { ballot_id })
  }


  updatEmailBatchId(voter_filter_id: string, email_batch_id: string) {
    return this.getRepository().update(voter_filter_id, { email_batch_id })
  }
}
