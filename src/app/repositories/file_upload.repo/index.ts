import { FileUploadEntity, IFileUpload, IUnsavedFileUpload } from "./file_upload.entity";
import { BaseRepo } from "../base-repo";

export class FileUploadRepository extends BaseRepo<FileUploadEntity, IFileUpload, IUnsavedFileUpload> {
  constructor() {
    super(FileUploadEntity, "fu");
  }
}
