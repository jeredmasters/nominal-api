
import { RunningEntity } from "../../repositories/running.repo/running.entity";
import { AdminBaseController } from "../util";

export class RunningController extends AdminBaseController {
  constructor() {
    super(RunningEntity)
  }

}
