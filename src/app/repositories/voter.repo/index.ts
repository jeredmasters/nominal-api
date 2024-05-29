import { VoterEntity, IVoter, IUnsavedVoter, VOTER_STATUS } from "./voter.entity";
import { BaseRepo } from "../base-repo";
import { IUnsavedVoterTag, VoterTagEntity } from "../voter_tag.repo/voter_tag.entity";
import { VoterFilter_Tag } from "../../domain/voter-filter";


export class VoterRepository extends BaseRepo<VoterEntity, IVoter, IUnsavedVoter> {
  constructor() {
    super(VoterEntity, "v")
  }

  getByElectionId(election_id: string) {
    return VoterEntity.findBy({ election_id });
  }
  getByElectionIdWithTags(election_id: string, tags: Array<VoterFilter_Tag>) {
    const query = VoterEntity.createQueryBuilder('v');
    query.where({ election_id })
    for (const tag of tags) {
      query.andWhereExists(
        VoterTagEntity
          .createQueryBuilder('vt')
          .where('vt.voter_id = v.id AND vt.key = :key', { key: tag.key })
      );
    }
    return query.getMany();
  }

  setStatus(voter_id: string, status: VOTER_STATUS) {
    // to prevent race conditions resulting from saving multiple ballots at once, we only want to set partial if it was previously VIEWED
    switch (status) {
      case VOTER_STATUS.VIEWED:
        return VoterEntity.update({ id: voter_id, status: VOTER_STATUS.INACTIVE }, { status });

      case VOTER_STATUS.PARTIAL_SUBMIT:
        return VoterEntity.update({ id: voter_id, status: VOTER_STATUS.VIEWED }, { status });

      default:
        return VoterEntity.update({ id: voter_id }, { status });
    }
  }
}