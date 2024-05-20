import { dependency } from "@foal/core";
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
import { comparePassword } from "../util/crypto";

export class AdminAuthService {
    @dependency
    adminTokenRepository: AdminTokenRepository;

    @dependency
    adminUserRepository: AdminUserRepository;

    @dependency
    adminPermissionRepository: AdminPermissionRepository;

    @dependency
    adminPasscodeRepository: AdminPasscodeRepository;

    @dependency
    adminEventLogRepository: AdminLogRepository;

    async login(email: string, password: string, deviceMeta?: any) {
        const admin = await this.adminUserRepository.getByEmail(email);
        if (!admin) {
            throw new InternalError({
                code: 'admin_not_found',
                func: 'AdminAuthService.login',
                type: ERROR_TYPE.NOT_FOUND,
                context: email
            })
        }
        const passwordEntity = await this.adminPasscodeRepository.getPasscodeForUser(admin.id, PASSCODE_TYPE.PASSWORD);
        if (!passwordEntity) {
            throw new InternalError({
                code: 'admin_passcode_not_found',
                func: 'AdminAuthService.login',
                type: ERROR_TYPE.NOT_ALLOWED,
                context: email
            })
        }
        const compare = await comparePassword(password, passwordEntity.value);
        console.log({ compare })
        if (compare !== true) {
            console.log(password, passwordEntity)
            throw new InternalError({
                code: 'admin_password_failed',
                func: 'AdminAuthService.login',
                type: ERROR_TYPE.NOT_ALLOWED,
                context: email
            })
        }

        return this.create(admin.id, deviceMeta);
    }

    async create(adminUserId: string, deviceMeta?: any) {
        const adminToken = await this.adminTokenRepository.save({
            admin_user_id: adminUserId,
            public_key: "pk_" + uuidv4(),
            secret_key: "sk_" + uuidv4(),
            client_ip: deviceMeta ? deviceMeta['client_ip'] : undefined,
            client_user_agent: deviceMeta ? deviceMeta['client_user_agent'] : undefined,
            device_meta: deviceMeta
        });

        await this.adminEventLogRepository.save({
            primary: ADMIN_EVENT.ADMIN_LOGIN,
            admin_user_id: adminUserId,
            meta: deviceMeta
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
        const adminToken = await this.adminTokenRepository.getByPublicKey(public_key);
        if (!adminToken) {
            throw new InternalError({
                code: 'admin_token_not_found',
                func: "AuthService.validate",
                context: authorizarion,
                type: ERROR_TYPE.NOT_AUTHORIZED
            })
        }
        return await this.adminUserRepository.getByIdOrThrow(adminToken.admin_user_id);
    }
}