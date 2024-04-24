
import { ResponseEntity } from "../../repositories/response.repo/reponse.entity";
import { AdminBaseController } from "../util";

export class ResponseController extends AdminBaseController {
  constructor() {
    super(ResponseEntity)
  }

}
