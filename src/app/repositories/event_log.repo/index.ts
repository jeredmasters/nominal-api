import { ERROR_TYPE, InternalError } from "../../domain/error";
import { EventLogEntity, IEventLog, IUnsavedEventLog } from "./event-log.entity";

export class EventLogRepository {
  getAll(): Promise<Array<IEventLog>> {
    return EventLogEntity.find()
  }
  getById(id: string): Promise<IEventLog | null> {
    return EventLogEntity.findOneBy({ id });
  }

  async getByIdOrThrow(id: string): Promise<IEventLog> {
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

  async save(unsaved: IUnsavedEventLog) {
    return EventLogEntity.save(unsaved as any);
  }
}
