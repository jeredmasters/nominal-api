import { AdminBaseController, errorToResponse } from "../util";
import { PROFILE_STATUS, ProfileEntity } from "../../repositories/profile.repo/profile.entity";
import { SelectQueryBuilder, ObjectLiteral } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { Context, HttpResponseOK, Post, dependency } from "@foal/core";
import { RunningRepository } from "../../repositories/running.repo";
import { ProfileRepository } from "../../repositories/profile.repo";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { CandidateEntity } from "../../repositories/candidate.repo/candidate.entity";
import { CandidateRepository } from "../../repositories/candidate.repo";
import { ProfileService } from "../../services/profile.service";



export class ProfileController extends AdminBaseController {
  @dependency
  runningRepo: RunningRepository;

  @dependency
  profileRepo: ProfileRepository;

  @dependency
  profileService: ProfileService;

  @dependency
  candidateRepo: CandidateRepository;

  constructor() {
    super(ProfileEntity, "p")
  }

  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "ballot_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "r.id = p.running_id")
        queryBuilder.andWhere('r.ballot_id = :ballot_id', { ballot_id: value })
        return true;
      default:
        super.applyFilter(queryBuilder, field, value);
        break;
    }
    return false
  }

  async beforeCreate(raw: any): Promise<any> {
    const { ballot_id, candidate_id } = raw;
    if (!candidate_id) {
      throw new InternalError({
        code: "candidate_id_required",
        func: "ProfileController",
        type: ERROR_TYPE.BAD_INPUT
      });
    }

    const running = ballot_id ? await this.runningRepo.getOrCreateRunning(candidate_id, ballot_id) : undefined;
    const running_id = running ? running.id : undefined;

    if (ballot_id && running_id) {
      delete raw.ballot_id;
      raw.running_id = running_id;
    }

    const previousVersions = await this.profileRepo.getByCandidate(candidate_id, running_id);

    raw.version = previousVersions.length + 1;

    if (!raw.status) {
      raw.status = PROFILE_STATUS.NEW;
    }

    return raw;
  }

  @Post("/:id/approve")
  async postApprove({ request }: Context) {
    try {
      const { id } = request.params;
      const result = await this.profileService.approve(id);
      return new HttpResponseOK(result);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }

  @Post("/:id/reject")
  async postReject({ request }: Context) {
    try {
      const { id } = request.params;
      const { reject_reason } = request.body;
      if (!reject_reason) {
        throw new InternalError({
          code: "reject_reason_required",
          func: "ProfileController",
          type: ERROR_TYPE.BAD_INPUT
        });
      }
      const result = await this.profileService.reject(id, reject_reason);
      return new HttpResponseOK(result);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }
}
