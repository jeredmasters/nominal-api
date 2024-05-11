import { VoterEntity, IVoter, IUnsavedVoter } from "./voter.entity";
import { BaseRepo } from "../base-repo";
import { IUnsavedVoterTag, VoterTagEntity } from "../voter_tag.repo/voter_tag.entity";
import { BallotCondition_Tag } from "../ballot.repo/ballot.entity";


export class VoterRepository extends BaseRepo<VoterEntity, IVoter, IUnsavedVoter> {
  constructor() {
    super(VoterEntity, "v")
  }

  getByElectionId(election_id: string) {
    return VoterEntity.findBy({ election_id });
  }
  getByElectionIdWithTags(election_id: string, tags: Array<BallotCondition_Tag>) {
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
}