import { AdminBaseController, errorToResponse } from "../util";
import { ELECTION_MODE, ELECTION_STATUS, ElectionEntity } from "../../repositories/election.repo/election.entity";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { dependency } from "@foal/core";
import { RunningRepository } from "../../repositories/running.repo";
import { ElectionRepository } from "../../repositories/election.repo";
import { VoterDigestRepository } from "../../repositories/voter_digest.repo";


export class ElectionController extends AdminBaseController {
  constructor() {
    super(ElectionEntity, "e")
  }

  @dependency
  electionRepo: ElectionRepository;

  @dependency
  runningRepository: RunningRepository;

  @dependency
  voterDigestRepo: VoterDigestRepository;


  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "candidate_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "e.id = r.election_id")
        queryBuilder.andWhere('r.candidate_id = :candidate_id', { candidate_id: value })
        return true;
      default:
        super.applyFilter(queryBuilder, field, value)
        break;
    }
    return false
  }

  async beforeCreate(raw: any): Promise<any> {
    if (!raw.status) {
      raw.status = ELECTION_STATUS.DRAFT;
    }
    if (!raw.mode) {
      raw.mode = ELECTION_MODE.MANUAL;
    }
    return raw;
  }

  async afterCreate(raw: any, election: ObjectLiteral): Promise<ObjectLiteral> {
    if (raw.candidate_id) {
      await this.runningRepository.getOrCreateRunning(raw.candidate_id, election.id);
    }
    return election;
  }

  async beforeQuery(queryBuilder: SelectQueryBuilder<ObjectLiteral>) {
    queryBuilder.addSelect("(select count(b.id) from ballots b where b.election_id = e.id) as ballot_count");
    queryBuilder.addSelect("(select count(v.id) from voters v where v.election_id = e.id) as voter_count");
    queryBuilder.addSelect("(select count(distinct r.candidate_id) from runnings r left join ballots b on r.ballot_id = b.id where b.election_id = e.id) as candidate_count")
  }
}

