import { AdminBaseController, errorToResponse } from "../util";
import { VOTER_DIGEST_STATUS, VoterDigestEntity } from "../../repositories/voter_digest.repo/voter_digest.entity";
import { Post, HttpResponseOK, Context, dependency } from "@foal/core";
import { ParseAndValidateFiles } from "@foal/storage";
import { InternalError, ERROR_TYPE } from "../../domain/error";
import { UploadService } from "../../services/upload.service";
import { parse } from 'papaparse';
import { VoterDigestRepository } from "../../repositories/voter_digest.repo";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { FileUploadEntity } from "../../repositories/file_upload.repo/file_upload.entity";
import { VoterDigestService } from "../../services/voter-digest.service";

export class VoterDigestController extends AdminBaseController {
  constructor() {
    super(VoterDigestEntity, "vd")
  }

  @dependency
  uploadService: UploadService;

  @dependency
  voterDigestRepo: VoterDigestRepository;

  @dependency
  voterDigestService: VoterDigestService;

  async beforeQuery(queryBuilder: SelectQueryBuilder<ObjectLiteral>) {
    queryBuilder.leftJoin(FileUploadEntity, "fu", "vd.file_upload_id = fu.id");
    queryBuilder.addSelect("fu.original_filename as original_filename");
  }

  @Post('/upload')
  @ParseAndValidateFiles({
    file: { required: true },
  })
  async uploadVoterCsv(ctx: Context) {
    try {
      const upload = ctx.files.get('file')[0];
      const { organisation_id, election_id, delimiter, linebreak, columns, first_row_is_headers } = ctx.request.body;

      if (!organisation_id) {
        throw new InternalError({
          code: 'organisation_id_required',
          func: 'uploadFile',
          type: ERROR_TYPE.BAD_INPUT
        });
      }
      if (!election_id) {
        throw new InternalError({
          code: 'election_id_required',
          func: 'uploadVoterCsv',
          type: ERROR_TYPE.BAD_INPUT
        });
      }

      const file = await this.uploadService.uploadFile(upload, organisation_id, "voter_csv", { election_id });

      const content = upload.buffer.toString();

      const lines = content.split('\n', 10)

      const voterDigest = await this.voterDigestRepo.save({
        file_upload_id: file.id,
        election_id: election_id,
        delimiter,
        status: VOTER_DIGEST_STATUS.UNPROCESSED,
        columns: typeof columns == "string" ? JSON.parse(columns) : columns,
        row_count: first_row_is_headers === "true" ? lines.length - 1 : lines.length,
        first_row_is_headers: first_row_is_headers === "true"
      });

      const voters = await this.voterDigestService.digest(voterDigest);

      return new HttpResponseOK({ voterDigest, voters });
    }
    catch (err) {
      return errorToResponse(err);
    }
  }
}
