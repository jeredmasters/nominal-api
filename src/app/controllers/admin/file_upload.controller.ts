import { AdminBaseController, errorToResponse } from "../util";
import { VoterDigestEntity } from "../../repositories/voter_digest.repo/voter_digest.entity";
import { Post, HttpResponseOK, Context, dependency } from "@foal/core";
import { Disk, ParseAndValidateFiles } from "@foal/storage";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { UploadService } from "../../services/upload.service";

export class VoterDigestController extends AdminBaseController {
  constructor() {
    super(VoterDigestEntity, "vd")
  }

  @dependency
  uploadService: UploadService;

  @Post('/upload')
  @ParseAndValidateFiles({
    file: { required: true },
  })
  async uploadFile(ctx: Context) {
    try {
      const upload = ctx.files.get('file')[0];
      const { organisation_id, purpose, election_id, candidate_id } = ctx.request.body;

      if (!organisation_id) {
        throw new InternalError({
          code: 'organisation_id_required',
          func: 'uploadFile',
          type: ERROR_TYPE.BAD_INPUT
        })
      }

      const file = await this.uploadService.uploadFile(upload, organisation_id, purpose, { election_id, candidate_id })
      return new HttpResponseOK(file);
    }
    catch (err) {
      return errorToResponse(err);
    }
  }
}
