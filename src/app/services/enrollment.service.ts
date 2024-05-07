import { dependency } from "@foal/core";
import { IVoter } from "../repositories/voter.repo/voter.entity";
import { IBallot } from "../repositories/ballot.repo/ballot.entity";

export class EnrollmentService {

    async isEnrolled(voter: IVoter, election_id: string): Promise<boolean> {
        return voter.election_id === election_id;
    }
    async isEligible(voter: IVoter, ballot: IBallot): Promise<boolean> {
        return voter.election_id === ballot.election_id;

    }
}