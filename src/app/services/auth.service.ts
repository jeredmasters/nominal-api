import { dependency } from "@foal/core";
import { ApiTokenRepository } from "../repositories/api-token.repo";
import { VoterRepository } from "../repositories/voter.repo";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { uuidv4 } from "../util/rand";
import { VOTER_STATUS } from "../repositories/voter.repo/voter.entity";

export class AuthService {
    @dependency
    apiTokenRepository: ApiTokenRepository;

    @dependency
    voterRepository: VoterRepository;

    async validate(authorizarion: string) {
        const apiToken = await this.apiTokenRepository.getByPublicKey(authorizarion);
        if (!apiToken) {
            throw new InternalError({
                code: 'api_token_not_found',
                func: "AuthService.validate",
                context: authorizarion,
                type: ERROR_TYPE.NOT_FOUND
            })
        }
        return await this.voterRepository.getByIdOrThrow(apiToken.voter_id);
    }

    async create(voter_id: string, email_token_id?: string) {
        await this.voterRepository.setStatus(voter_id, VOTER_STATUS.VIEWED)

        return this.apiTokenRepository.save({
            public_key: "pk_" + uuidv4(),
            secret_key: "sk_" + uuidv4(),
            voter_id: voter_id,
            email_token_id
        })
    }
}