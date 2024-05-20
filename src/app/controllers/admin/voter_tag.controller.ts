import { IUnsavedVoter } from "../../repositories/voter.repo/voter.entity";
import { VoterTagEntity } from "../../repositories/voter_tag.repo/voter_tag.entity";
import { AdminBaseController } from "../util";


export class voterTagController extends AdminBaseController {
  constructor() {
    super(VoterTagEntity, "vt")
  }

  async beforeCreate(raw: any): Promise<IUnsavedVoter | Array<IUnsavedVoter>> {
    if (Array.isArray(raw.voter_id)) {
      return raw.voter_id.map((voter_id): IUnsavedVoter => ({
        ...raw,
        voter_id
      }))
    }
    return raw;
  }
}
