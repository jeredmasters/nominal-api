import { Context, Get, HttpResponseOK, dependency } from "@foal/core";
import { AdminBaseController, errorToResponse } from "../util";
import { CandidateEntity } from "../../repositories/candidate.repo/candidate.entity";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { RunningRepository } from "../../repositories/running.repo";
import { BallotRepository } from "../../repositories/ballot.repo";
import { ERROR_TYPE, InternalError } from "../../domain/error";



export class CandidateController extends AdminBaseController {
  constructor() {
    super(CandidateEntity, "c")
  }

  @dependency
  runningRepository: RunningRepository;

  @dependency
  ballotRepo: BallotRepository;

  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "ballot_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "c.id = r.candidate_id")
        queryBuilder.andWhere('r.ballot_id = :ballot_id', { ballot_id: value })
        return true;
      default:
        super.applyFilter(queryBuilder, field, value);
        break;
    }
    return false
  }
  async beforeCreate(raw: any): Promise<any> {
    if (!raw.election_id) {
      if (raw.ballot_id) {
        const ballot = await this.ballotRepo.getByIdOrThrow(raw.ballot_id);
        raw.election_id = ballot.election_id;
      }
      else {
        throw new InternalError({
          code: "election_id_required",
          func: "CandidateController",
          type: ERROR_TYPE.BAD_INPUT
        })
      }
    }
    return raw;
  }
  async afterCreate(raw: any, candidate: ObjectLiteral): Promise<ObjectLiteral> {
    if (raw.ballot_id) {
      await this.runningRepository.getOrCreateRunning(candidate.id, raw.ballot_id);
    }
    return candidate;
  }
}
