import { AdminBaseController } from "../util";
import { ElectionEntity } from "../../repositories/election.repo/election.entity";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { EnrollmentEntity } from "../../repositories/enrollment.repo/enrollment.entity";
import { dependency } from "@foal/core";
import { RunningRepository } from "../../repositories/running.repo";


export class ElectionController extends AdminBaseController {
  constructor() {
    super(ElectionEntity, "e")
  }

  @dependency
  runningRepository: RunningRepository;


  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    switch (field) {
      case "candidate_id":
        queryBuilder.leftJoin(RunningEntity, 'r', "e.id = r.election_id")
        queryBuilder.where('r.candidate_id = :candidate_id', { candidate_id: value })
        return true;
      case "voter_id":
        queryBuilder.leftJoin(EnrollmentEntity, 'r', "e.id = r.election_id")
        queryBuilder.where('r.voter_id = :voter_id', { voter_id: value })
        return true;
    }
    return false
  }

  async afterCreate(raw: any, election: ObjectLiteral): Promise<ObjectLiteral> {
    if (raw.candidate_id) {
      await this.runningRepository.getOrCreateRunning(raw.candidate_id, election.id);
    }
    return election;
  }
}
