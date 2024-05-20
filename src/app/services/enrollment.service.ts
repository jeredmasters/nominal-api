import { dependency } from "@foal/core";
import { IVoter } from "../repositories/voter.repo/voter.entity";
import { IBallot } from "../repositories/ballot.repo/ballot.entity";
import { BallotRepository } from "../repositories/ballot.repo";
import { VoterTagRepository } from "../repositories/voter_tag.repo";
import { IUnsavedVoterTag } from "../repositories/voter_tag.repo/voter_tag.entity";
import { VoterRepository } from "../repositories/voter.repo";
import { VoterFilterRepository } from "../repositories/voter-filter.repo";

export class EnrollmentService {
    @dependency
    ballotRepo: BallotRepository;

    @dependency
    voterTagRepo: VoterTagRepository;

    @dependency
    voterRepo: VoterRepository;

    @dependency
    voterFilterRepo: VoterFilterRepository;

    async isEnrolled(voter: IVoter, election_id: string): Promise<boolean> {
        return voter.election_id === election_id;
    }
    async isEligible(voter: IVoter, ballot: IBallot): Promise<boolean> {
        return voter.election_id === ballot.election_id;

    }

    async getEligibleBallots(voter: IVoter) {
        return await this.ballotRepo.getEligibleBallots(voter);
    }

    async getEligibleVoters(ballot: IBallot) {
        if (!ballot.voter_filter_id) {
            return this.voterRepo.getByElectionId(ballot.election_id);
        }
        const filter = await this.voterFilterRepo.getByIdOrThrow(ballot.voter_filter_id);
        return filter.voter_ids
    }
}