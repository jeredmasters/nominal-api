import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { EMAIL_TOKEN_STATUS, EmailTokenEntity, IEmailToken, IUnsavedEmailToken } from "./email-token.entity";

export class EmailTokenRepository {
  getAll(): Promise<Array<IEmailToken>> {
    return EmailTokenEntity.find()
  }
  getById(id: string): Promise<IEmailToken | null> {
    return EmailTokenEntity.findOneBy({ id });
  }
  setStatus(id: string, status: EMAIL_TOKEN_STATUS) {
    return EmailTokenEntity.update(id, { status });
  }

  async getByIdOrThrow(id: string): Promise<IEmailToken> {
    const account = await this.getById(id);
    if (!account) {
      throw new InternalError({
        code: "account_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return account;
  }

  async save(unsaved: IUnsavedEmailToken) {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return EmailTokenEntity.save(unsaved as any);
  }
}
