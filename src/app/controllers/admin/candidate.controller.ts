import { Context, Get, HttpResponseOK, dependency } from "@foal/core";
import { AdminBaseController, errorToResponse } from "../util";
import { CandidateEntity } from "../../repositories/candidate.repo/candidate.entity";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { RunningRepository } from "../../repositories/running.repo";



export class CandidateController extends AdminBaseController {
  constructor() {
    super(CandidateEntity, "c")
  }

  @dependency
  runningRepository: RunningRepository;

  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "ballot_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "c.id = r.candidate_id")
        queryBuilder.andWhere('r.ballot_id = :ballot_id', { ballot_id: value })
        return true;
      default:
        queryBuilder.andWhere({ [field]: value });
        break;
    }
    return false
  }

  async afterCreate(raw: any, candidate: ObjectLiteral): Promise<ObjectLiteral> {
    if (raw.election_id) {
      await this.runningRepository.getOrCreateRunning(candidate.id, raw.election_id);
    }
    return candidate;
  }
}
