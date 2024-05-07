import { dependency, File } from "@foal/core";
import { Disk } from "@foal/storage";
import { InternalError, ERROR_TYPE } from "../domain/error";
import { FileUploadRepository } from "../repositories/file_upload.repo";

interface UploadRelations {
    election_id?: string;
    candidate_id?: string;
}

export class UploadService {
    @dependency
    fileUploadRepo: FileUploadRepository;

    @dependency
    disk: Disk;


    async uploadFile(upload: File, organisation_id: string, purpose: string, relations?: UploadRelations) {
        if (!organisation_id) {
            throw new InternalError({
                code: 'organisation_id_required',
                func: 'uploadFile',
                type: ERROR_TYPE.BAD_INPUT
            })
        }

        const { election_id, candidate_id } = relations || {};
        const filename = upload.filename || "unknown";
        const store_path = `admin_uploads`;

        const file = await this.fileUploadRepo.save({
            original_filename: filename,
            original_extension: getExtension(filename),
            purpose,
            store_path,
            organisation_id,
            election_id,
            candidate_id
        });

        const saveResult = await this.disk.write(store_path, upload.buffer, { name: file.id });

        return file;

    }
}

const getExtension = (filename: string) => {
    return filename.split('.').pop() || "";

}