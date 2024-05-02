import { dependency } from "@foal/core";
import { EnrollmentRepository } from "../repositories/enrollment.repo";

export class EnrollmentService {
    @dependency
    enrollmentRepository: EnrollmentRepository;

    async isEnrolled(voter_id: string, election_id: string): Promise<boolean> {
        const exists = await this.enrollmentRepository.getEnrollment(voter_id, election_id);

        return !!exists
    }
}