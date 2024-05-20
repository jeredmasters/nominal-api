import { Context, Get, HttpResponseOK, Post } from "@foal/core";
import { dependency } from "@foal/core/lib/core/service-manager";

import { ElectionRepository } from "../../repositories/election.repo";
import { IVoter } from "../../repositories/voter.repo/voter.entity";
import { ResponseRepository } from "../../repositories/response.repo";
import { errorToResponse } from "../util";
import { EnrollmentService } from "../../services/enrollment.service";
import { ERROR_TYPE, InternalError } from "../../domain/error";


export class ResponseController {
  @dependency
  private readonly electionRepository: ElectionRepository;

  @dependency
  private readonly responseRepository: ResponseRepository;

  @dependency
  enrollmentService: EnrollmentService;


}
