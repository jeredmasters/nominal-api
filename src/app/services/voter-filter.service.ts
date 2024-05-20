import { dependency } from "@foal/core";
import { Disk } from "@foal/storage";
import { FileUploadRepository } from "../repositories/file_upload.repo";
import { IUnsavedVoter, VoterEntity } from "../repositories/voter.repo/voter.entity";
import { VoterRepository } from "../repositories/voter.repo";
import { VoterTagRepository } from "../repositories/voter_tag.repo";
import { IUnsavedVoterFilter } from "../repositories/voter-filter.repo/voter-filter.entity";
import { VoterFilterRepository } from "../repositories/voter-filter.repo";
import { CONDITION_TYPE, VoterFilter } from "../domain/voter-filter";
import { SelectQueryBuilder } from "typeorm";
import { VoterTagEntity } from "../repositories/voter_tag.repo/voter_tag.entity";

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

interface FilterResult {
    success: boolean;
    message?: string;
    voter: IUnsavedVoter;
    internalError?: any;
}

export class VoterFilterService {
    @dependency
    voterFilterRepo: VoterFilterRepository;

    @dependency
    fileUploadRespoitory: FileUploadRepository;

    @dependency
    voterRepository: VoterRepository;


    @dependency
    voterTagRepository: VoterTagRepository;

    @dependency
    disk: Disk;

    async saveWithMetadata(voterFilter: IUnsavedVoterFilter) {
        const [voters, count] = await this.getVoters(voterFilter.election_id, voterFilter.where);
        voterFilter.voter_count = voters.length;
        voterFilter.voter_ids = voters.map(v => v.id);

        return this.voterFilterRepo.save(voterFilter);
    }

    async getVoters(election_id: string, filter?: VoterFilter, limit?: number) {
        console.log({ election_id, filter, limit })
        const query = VoterEntity.createQueryBuilder('v');
        if (filter && filter.type) {
            query.andWhere(qb => applyFilter(qb, filter))
        }
        if (limit) {
            query.limit(limit);
        }
        query.andWhere('v.election_id = :election_id', { election_id });
        console.log({ sql: query.getSql(), params: query.getParameters() })
        return query.getManyAndCount()
    }
}

const applyFilter = (query: SelectQueryBuilder<VoterEntity>, filter: VoterFilter) => {
    console.log(filter.type);
    switch (filter.type) {
        case CONDITION_TYPE.TAG_EQUALS:
            if (filter.split_lines) {
                const values = filter.value.split('\n');
                query.whereExists(VoterTagEntity.createQueryBuilder('vt').where('(vt.voter_id = v.id AND vt.key = :key AND vt.value IN (:...values))', {
                    key: filter.key,
                    values: values
                }));
            }
            else {
                query.whereExists(VoterTagEntity.createQueryBuilder('vt').where('(vt.voter_id = v.id AND vt.key = :key AND vt.value = :value)', {
                    key: filter.key,
                    value: filter.value
                }));
            }
            return;
        case CONDITION_TYPE.MEETS_ALL:
            query.andWhere(qb => {
                for (const c of filter.conditions) {
                    qb.andWhere(qb2 => applyFilter(qb2, c))
                }
            });
            return;
        case CONDITION_TYPE.MEETS_ANY:
            query.andWhere(qb => {
                for (const c of filter.conditions) {
                    qb.orWhere(qb2 => applyFilter(qb2, c))
                }
            });
            return;
    }
}