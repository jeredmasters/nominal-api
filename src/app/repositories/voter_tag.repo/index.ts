import { IVoterTag, IUnsavedVoterTag, VoterTagEntity } from "./voter_tag.entity";
import { BaseRepo } from "../base-repo";
import { VoterEntity } from "../voter.repo/voter.entity";

export class VoterTagRepository extends BaseRepo<VoterTagEntity, IVoterTag, IUnsavedVoterTag> {
  constructor() {
    super(VoterTagEntity, "vt")
  }

  getByVoterId(voter_id: string) {
    return VoterTagEntity.findBy({ voter_id });
  }
  async getTagKeysByElectionId(election_id: string): Promise<Array<{ key: string, count: number }>> {
    const rows = await VoterTagEntity
      .createQueryBuilder('vt')
      .select('vt.key, count(v.id)')
      .leftJoin(VoterEntity, 'v', 'vt.voter_id = v.id')
      .where('v.election_id = :election_id', { election_id })
      .groupBy('vt.key')
      .getRawMany();
    return rows;
  }
  async getTagValuesByElectionId(election_id: string, key: string): Promise<Array<{ value: string, count: number }>> {
    const rows = await VoterTagEntity
      .createQueryBuilder('vt')
      .select('vt.key, count(v.id)')
      .leftJoin(VoterEntity, 'v', 'vt.voter_id = v.id')
      .where('v.election_id = :election_id AND vt.key = :key', { election_id, key })
      .groupBy('vt.key')
      .getRawMany();
    return rows;
  }
}
