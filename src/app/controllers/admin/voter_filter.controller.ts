import { Context, HttpResponseOK, Post, dependency } from "@foal/core";
import { VoterFilterEntity } from "../../repositories/voter-filter.repo/voter-filter.entity";
import { AdminBaseController, errorToResponse } from "../util";
import { VoterFilterService } from "../../services/voter-filter.service";


export class VoterFilterController extends AdminBaseController {
  constructor() {
    super(VoterFilterEntity, "vf")
  }

  @dependency
  voterFilterService: VoterFilterService;

  async beforeCreate(raw: any): Promise<any> {
    const [voters, count] = await this.voterFilterService.getVoters(raw.election_id, raw.where);
    raw.voter_count = count;
    raw.voter_ids = voters.map(v => v.id);
    return raw;
  }


}
