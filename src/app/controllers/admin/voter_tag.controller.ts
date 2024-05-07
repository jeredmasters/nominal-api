import { VoterTagEntity } from "../../repositories/voter_tag.repo/voter_tag.entity";
import { AdminBaseController } from "../util";


export class voterTagController extends AdminBaseController {
  constructor() {
    super(VoterTagEntity, "vt")
  }
}
