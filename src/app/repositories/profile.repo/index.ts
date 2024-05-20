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

  setStatus(id: string, status: PROFILE_STATUS, rejected_reason?: string) {
    return ProfileEntity.update(id, { status, rejected_reason });
  }
}
