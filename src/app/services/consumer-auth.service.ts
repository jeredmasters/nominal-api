import { HttpResponseOK, dependency } from "@foal/core";
import { AdminTokenRepository } from "../repositories/admin-token.repo";
import { AdminUserRepository } from "../repositories/admin-user.repo";
import { AdminPermissionRepository } from "../repositories/admin-permissions.repo";
import { AdminPasscodeRepository } from "../repositories/admin-passcode.repo";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { PASSCODE_TYPE } from "../repositories/admin-passcode.repo/admin-passcode.entity";
import { uuidv4 } from "../util/rand";
import { AdminLogRepository } from "../repositories/admin_log.repo";
import { ADMIN_EVENT } from "../repositories/admin_log.repo/admin-log.entity";
import * as jwt from 'jwt-simple';
import { ApiTokenRepository } from "../repositories/api-token.repo";
import { VoterRepository } from "../repositories/voter.repo";
import { EmailTokenRepository } from "../repositories/email-token.repo";
import { EMAIL_TOKEN_STATUS } from "../repositories/email-token.repo/email-token.entity";
import { EVENT_PRIMARY } from "../repositories/event_log.repo/event-log.entity";
import { EventLogRepository } from "../repositories/event_log.repo";

export class ConsumerAuthService {
    @dependency
    apiTokenRepo: ApiTokenRepository;

    @dependency
    voterRepo: VoterRepository;

    @dependency
    emailTokenRepository: EmailTokenRepository;

    @dependency
    eventLogRepository: EventLogRepository;

    async loginByEmailToken(email_token_id) {
        const email_token = await this.emailTokenRepository.getById(email_token_id);
        if (!email_token) {
            throw new InternalError({
                code: "email_token_not_found",
                func: "postEmailToken",
                context: email_token_id,
                type: ERROR_TYPE.NOT_FOUND
            });
        }
        if (email_token.status === EMAIL_TOKEN_STATUS.EXPIRED) {
            throw new InternalError({
                code: "email_token_expired",
                func: "postEmailToken",
                context: email_token_id,
                type: ERROR_TYPE.NOT_ALLOWED
            });
        }
        if (email_token.status === EMAIL_TOKEN_STATUS.DISABLED) {
            throw new InternalError({
                code: "email_token_disabled",
                func: "postEmailToken",
                context: email_token_id,
                type: ERROR_TYPE.NOT_ALLOWED
            });
        }
        await this.emailTokenRepository.setStatus(email_token.id, EMAIL_TOKEN_STATUS.OPENED);

        const api_token = await this.create(email_token.voter_id, email_token.id);
        await this.eventLogRepository.save({
            primary: EVENT_PRIMARY.OPEN_EMAIL_TOKEN,
            email_token_id: email_token.id,
            api_token_id: api_token.id,
            voter_id: email_token.voter_id
        })
        return new HttpResponseOK(api_token);
    }

    async create(voterId: string, deviceMeta?: any) {
        const adminToken = await this.apiTokenRepo.save({
            voter_id: voterId,
            public_key: "pk_" + uuidv4(),
            secret_key: "sk_" + uuidv4(),
            client_ip: deviceMeta ? deviceMeta['client_ip'] : undefined,
            client_user_agent: deviceMeta ? deviceMeta['client_user_agent'] : undefined,
            //device_meta: deviceMeta
        });

        return adminToken;
    }


    async validate(authorizarion: string) {
        const bearer = authorizarion.replace('Bearer', '').trim();
        var decoded = jwt.decode(bearer, "", true);
        console.log(decoded); //=> { foo: 'bar' }
        const { public_key } = decoded;
        if (!public_key) {
            throw new InternalError({
                code: 'token_missing_public_key',
                func: "AuthService.validate",
                context: authorizarion,
                type: ERROR_TYPE.NOT_FOUND,
                meta: decoded
            })
        }
        const token = await this.apiTokenRepo.getByPublicKey(public_key);
        if (!token) {
            throw new InternalError({
                code: 'token_not_found',
                func: "AuthService.validate",
                context: authorizarion,
                type: ERROR_TYPE.NOT_FOUND
            })
        }
        return await this.voterRepo.getByIdOrThrow(token.voter_id);
    }
}