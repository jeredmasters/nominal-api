import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
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

      default:
        super.applyFilter(queryBuilder, field, value);
        break;

    }
  }

}
