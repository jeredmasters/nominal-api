import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { ProfileEntity, IProfile, IUnsavedProfile, PROFILE_STATUS } from "./profile.entity";
import { BaseRepo } from "../base-repo";

export class ProfileRepository extends BaseRepo<ProfileEntity, IProfile, IUnsavedProfile> {
  constructor() {
    super(ProfileEntity, 'p')
  }

  getByCandidate(candidate_id: string, running_id?: string) {
    return ProfileEntity.findBy({ candidate_id, running_id })
  }


  approve(id: string) {
    return ProfileEntity.update(id, { status: PROFILE_STATUS.APPROVED });
  }

  reject(id: string, rejected_reason: string) {
    return ProfileEntity.update(id, { status: PROFILE_STATUS.REJECTED, rejected_reason });
  }
}
