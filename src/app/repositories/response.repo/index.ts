import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { ResponseEntity, IResponse, IUnsavedResponse } from "./reponse.entity";
import { BaseRepo } from "../base-repo";

export class ResponseRepository extends BaseRepo<ResponseEntity, IResponse, IUnsavedResponse> {
  constructor() {
    super(ResponseEntity, "re")
  }

  getByVoterId(voter_id: string) {
    return ResponseEntity.findBy({ voter_id })
  }
}
