import { dependency } from "@foal/core";
import { ElectionRepository } from "../repositories/election.repo";
import { EnrollmentRepository } from "../repositories/enrollment.repo";
import { CandidateRepository } from "../repositories/candidate.repo";
import { RunningRepository } from "../repositories/running.repo";

export class ElectionService {
    @dependency
    electionRepository: ElectionRepository;

    @dependency
    enrollmentRepository: EnrollmentRepository;

    @dependency
    runningRepository: RunningRepository;

    async createFromPrevious(copyElectionId: string, opens_at: Date, closes_at: Date) {
        const template = await this.electionRepository.getByIdOrThrow(copyElectionId);
        const election = await this.electionRepository.save({
            label: template.label,
            organisation_id: template.organisation_id,
            type: template.type,
            closes_at: closes_at,
            opens_at: opens_at,
            copy_election_id: template.id
        });

        const oldEnrollments = await this.enrollmentRepository.getByElectionId(template.id);
        const enrollments = await Promise.all(oldEnrollments.map(e => this.enrollmentRepository.getOrCreateEnrollment(e.voter_id, election.id)))

        const oldRunnings = await this.runningRepository.getByElectionId(template.id);
        const runnings = await Promise.all(oldRunnings.map(r => this.runningRepository.getOrCreateRunning(r.candidate_id, election.id)))

        return election;
    }
} 