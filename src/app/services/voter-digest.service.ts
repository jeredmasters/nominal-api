import { dependency } from "@foal/core";
import { VoterDigestRepository } from "../repositories/voter_digest.repo";
import { IVoterDigest } from "../repositories/voter_digest.repo/voter_digest.entity";
import { Disk } from "@foal/storage";
import { FileUploadRepository } from "../repositories/file_upload.repo";
import { parse } from "papaparse";
import { IUnsavedVoter, IVoter } from "../repositories/voter.repo/voter.entity";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { VoterRepository } from "../repositories/voter.repo";
import { VoterTagRepository } from "../repositories/voter_tag.repo";

interface ParseResult {
    data: Array<string[]>;
    errors: Array<any>;
    meta: {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
    };
}
interface DigestResult {
    success: boolean;
    message?: string;
    voter: IUnsavedVoter;
    internalError?: any;
}
export class VoterDigestService {
    @dependency
    voterDigestRepo: VoterDigestRepository;

    @dependency
    fileUploadRespoitory: FileUploadRepository;

    @dependency
    voterRepository: VoterRepository;


    @dependency
    voterTagRepository: VoterTagRepository;

    @dependency
    disk: Disk;

    async digest(voterDigest: IVoterDigest) {
        const fileUpload = await this.fileUploadRespoitory.getByIdOrThrow(voterDigest.file_upload_id);
        const fileBuffer = await this.disk.read(fileUpload.store_path + "/" + fileUpload.id, 'buffer');

        const parsed: ParseResult = parse<string[]>(fileBuffer.file.toString(), {
            delimiter: voterDigest.delimiter
        });

        if (!voterDigest.columns) {
            throw new InternalError({
                code: "column_definition_missing",
                func: "VoterDigestService",
                type: ERROR_TYPE.BAD_INPUT,
                context: voterDigest.id,
                meta: voterDigest
            })
        }

        const firstName = voterDigest.columns.find(c => c.target == "first_name")
        const lastName = voterDigest.columns.find(c => c.target == "last_name")
        const email = voterDigest.columns.find(c => c.target == "email")
        const preferredName = voterDigest.columns.find(c => c.target == "preferred_name")
        const tags = voterDigest.columns.filter(c => c.target === "tag");

        if (!firstName) {
            throw new InternalError({
                code: "first_name_required_for_parsing",
                func: "VoterDigestService",
                type: ERROR_TYPE.BAD_INPUT
            });
        }
        if (!lastName) {
            throw new InternalError({
                code: "last_name_required_for_parsing",
                func: "VoterDigestService",
                type: ERROR_TYPE.BAD_INPUT
            });
        }
        if (!email) {
            throw new InternalError({
                code: "email_required_for_parsing",
                func: "VoterDigestService",
                type: ERROR_TYPE.BAD_INPUT
            });
        }

        if (voterDigest.first_row_is_headers) {
            parsed.data.shift();
        }

        console.log(voterDigest.columns);

        const voters = Promise.all(parsed.data.map(async (row, i): Promise<DigestResult> => {
            const unsaved: IUnsavedVoter = {
                election_id: voterDigest.election_id,
                voter_digest_id: voterDigest.id,
                first_name: row[firstName.index],
                last_name: row[lastName.index],
                email: row[email.index],
                preferred_name: preferredName ? row[preferredName.index] : undefined,
            }
            if (!unsaved.first_name || unsaved.first_name === "") {
                return { success: false, message: "first_name_missing", voter: unsaved };
            }
            if (!unsaved.last_name || unsaved.last_name === "") {
                return { success: false, message: "last_name_missing", voter: unsaved };
            }
            if (!unsaved.email || unsaved.email === "") {
                return { success: false, message: "email_missing", voter: unsaved };
            }
            try {
                const voter = await this.voterRepository.save(unsaved)

                await Promise.all(tags.map(t => this.voterTagRepository.save({
                    voter_id: voter.id,
                    key: t.label,
                    value: row[t.index]
                })));

                return { success: true, voter };
            }
            catch (err) {
                console.error(err);
                return { success: false, message: "unknown_error", voter: unsaved, internalError: err };
            }
        }))

        return voters;
    }
}