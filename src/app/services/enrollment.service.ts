import { dependency } from "@foal/core";
import { IVoter } from "../repositories/voter.repo/voter.entity";
import { VoterCondition, CONDITION_TYPE, IBallot } from "../repositories/ballot.repo/ballot.entity";
import { BallotRepository } from "../repositories/ballot.repo";
import { VoterTagRepository } from "../repositories/voter_tag.repo";
import { IUnsavedVoterTag } from "../repositories/voter_tag.repo/voter_tag.entity";
import { VoterRepository } from "../repositories/voter.repo";

export class EnrollmentService {
    @dependency
    ballotRepo: BallotRepository;

    @dependency
    voterTagRepo: VoterTagRepository;

    @dependency
    voterRepo: VoterRepository;

    async isEnrolled(voter: IVoter, election_id: string): Promise<boolean> {
        return voter.election_id === election_id;
    }
    async isEligible(voter: IVoter, ballot: IBallot): Promise<boolean> {
        return voter.election_id === ballot.election_id;

    }

    async getEligibleBallots(voter: IVoter) {
        const potentialBallots = await this.ballotRepo.getByElectionId(voter.election_id);
        const tags = await this.voterTagRepo.getByVoterId(voter.id);
        return potentialBallots.filter(b => {
            if (!b.condition) {
                return true;
            }
            return evaluateCondition(b.condition, tags);
        })
    }

    async getEligibleVoters(ballot: IBallot) {
        if (!ballot.condition) {
            return this.voterRepo.getByElectionId(ballot.election_id);
        }
        return this.voterRepo.getByElectionIdWithTags(ballot.election_id, [ballot.condition])
    }
}

const evaluateCondition = (condition: VoterCondition, tags: Array<IUnsavedVoterTag>) => {
    switch (condition.type) {
        case CONDITION_TYPE.TAG_EQUALS:
            const tag = tags.find(t => t.key === condition.key);
            return tag && tag.value === condition.value;
    }
    return false;
}