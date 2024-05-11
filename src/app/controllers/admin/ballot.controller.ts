import { AdminBaseController } from "../util";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { dependency } from "@foal/core";
import { RunningRepository } from "../../repositories/running.repo";
import { BallotEntity } from "../../repositories/ballot.repo/ballot.entity";
import { ElectionEntity } from "../../repositories/election.repo/election.entity";


export class BallotController extends AdminBaseController {
  constructor() {
    super(BallotEntity, "b")
  }

  @dependency
  runningRepository: RunningRepository;


  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "candidate_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "b.id = r.ballot_id")
        queryBuilder.andWhere('r.candidate_id = :candidate_id', { candidate_id: value })
        return true;
      case "organisation_id":
        queryBuilder.leftJoin(ElectionEntity, 'e', "e.id = b.election_id")
        queryBuilder.andWhere('e.organisation_id = :organisation_id', { organisation_id: value })
        return true;
      default:
        super.applyFilter(queryBuilder, field, value);
        break;
    }
    return false
  }

  async afterCreate(raw: any, election: ObjectLiteral): Promise<ObjectLiteral> {
    if (raw.candidate_id) {
      await this.runningRepository.getOrCreateRunning(raw.candidate_id, election.id);
    }
    return election;
  }

  async beforeQuery(queryBuilder: SelectQueryBuilder<ObjectLiteral>) {
    queryBuilder.addSelect("(select count(r.id) from runnings r where r.ballot_id = b.id) as running_count")
  }
}
