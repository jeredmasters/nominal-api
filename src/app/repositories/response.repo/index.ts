import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { Response, IResponse } from "./reponse.entity";

export class ResponseRepository extends Repository<Response> {
  getAll(): Promise<Array<IResponse>> {
    return Response.find()
  }
  getById(id: string): Promise<IResponse | null> {
    return Response.findOneBy({ id })
  }
  async getByIdOrThrow(id: string): Promise<IResponse> {
    const response = await this.getById(id);
    if (!response) {
      throw new InternalError({
        code: "response_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return response;
  }
}
