import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { EnrollmentEntity } from "../../repositories/enrollment.repo/enrollment.entity";
import { VoterEntity } from "../../repositories/voter.repo/voter.entity";
import { AdminBaseController } from "../util";

export class VoterController extends AdminBaseController {
  constructor() {
    super(VoterEntity, "v")
  }

  applyFilter(queryBuilder: SelectQueryBuilder<ObjectLiteral>, field: string, value: any) {
    console.log("OVERRIDE FILTER", field)

    switch (field) {
      case "q":
        queryBuilder.andWhere('(v.first_name ilike :q OR v.last_name ilike :q)', { q: value });
        break;

      case "election_id":
        queryBuilder.leftJoin(EnrollmentEntity, 'r', "v.id = r.voter_id")
        queryBuilder.andWhere('r.election_id = :election_id', { election_id: value })
        break;

      default:
        queryBuilder.andWhere({ [field]: value });
        break;

    }
  }

}
