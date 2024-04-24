import { AdminBaseController } from "../util";
import { OrganisationEntity } from "../../repositories/organisation.repo/organisation.entity";

export class OrganisationController extends AdminBaseController {
  constructor() {
    super(OrganisationEntity)
  }

}
