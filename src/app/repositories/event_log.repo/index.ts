import { ERROR_TYPE, InternalError } from "../../domain/error";
import { EventLog, IEventLog, IUnsavedEventLog } from "./event-log.entity";

export class EventLogRepository {
  getAll(): Promise<Array<IEventLog>> {
    return EventLog.find()
  }
  getById(id: string): Promise<IEventLog | null> {
    return EventLog.findOneBy({ id });
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
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return EventLog.save(unsaved as any);
  }
}
