import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { OrganisationEntity, IOrganisation, IUnsavedOrganisation } from "./organisation.entity";

export class OrganisationRepository {
  getAll(): Promise<Array<IOrganisation>> {
    return OrganisationEntity.find()
  }
  getById(id: string): Promise<IOrganisation | null> {
    return OrganisationEntity.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IOrganisation> {
    const organisation = await this.getById(id);
    if (!organisation) {
      throw new InternalError({
        code: "organisation_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return organisation;
  }

  async save(unsaved: IUnsavedOrganisation): Promise<IOrganisation> {
    return OrganisationEntity.save(unsaved as any);
  }
}
