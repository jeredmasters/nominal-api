import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { BallotEntity, IBallot, IUnsavedBallot } from "./ballot.entity";
import { IVoter } from "../voter.repo/voter.entity";
import { VoterFilterEntity } from "../voter-filter.repo/voter-filter.entity";
import { BaseRepo } from "../base-repo";

export class BallotRepository extends BaseRepo<BallotEntity, IBallot, IUnsavedBallot> {
  constructor() {
    super(BallotEntity, 'b');
  }
  getByElectionId(election_id: string): Promise<IBallot[]> {
    return BallotEntity.findBy({ election_id })
  }
  getEligibleBallots(voter: IVoter): Promise<IBallot[]> {
    const query = BallotEntity.createQueryBuilder('b')
      .select('b.*')
      .leftJoin(VoterFilterEntity, 'vf', 'b.voter_filter_id = vf.id')
      .where('b.election_id = :election_id', { election_id: voter.election_id })
      .andWhere('(vf.voter_ids IS NULL OR vf.voter_ids ? :voter_id)', { voter_id: voter.id });

    return query.getRawMany()
  }
}
