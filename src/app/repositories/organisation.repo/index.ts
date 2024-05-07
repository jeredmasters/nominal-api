
import { OrganisationEntity, IOrganisation, IUnsavedOrganisation } from "./organisation.entity";
import { BaseRepo } from "../base-repo";

export class OrganisationRepository extends BaseRepo<OrganisationEntity, IOrganisation, IUnsavedOrganisation> {
  constructor() {
    super(OrganisationEntity, "re")
  }
}