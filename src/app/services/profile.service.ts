import { dependency } from "@foal/core";
import { ProfileRepository } from "../repositories/profile.repo";
import { CandidateRepository } from "../repositories/candidate.repo";
import { PROFILE_STATUS } from "../repositories/profile.repo/profile.entity";
import { RunningRepository } from "../repositories/running.repo";

export class ProfileService {
    @dependency
    profileRepository: ProfileRepository;

    @dependency
    candidateRepository: CandidateRepository;

    @dependency
    runningRepository: RunningRepository;

    async approve(profile_id: string) {
        const profile = await this.profileRepository.getByIdOrThrow(profile_id);
        await this.profileRepository.setStatus(profile_id, PROFILE_STATUS.APPROVED);
        if (profile.running_id) {
            await this.runningRepository.setProfile(profile.running_id, profile_id)
        } else {
            await this.candidateRepository.setProfile(profile.candidate_id, profile_id);
        }
    }

    async reject(profile_id: string, reject_reason: string) {
        return this.profileRepository.setStatus(profile_id, PROFILE_STATUS.REJECTED, reject_reason);
    }
}