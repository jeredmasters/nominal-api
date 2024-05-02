import { Repository } from "typeorm";
import { ERROR_TYPE, InternalError } from "../../domain/error";
import { BallotEntity, IBallot, IUnsavedBallot } from "./ballot.entity";

export class BallotRepository {
  getAll(): Promise<Array<IBallot>> {
    return BallotEntity.find()
  }
  getById(id: string): Promise<IBallot | null> {
    return BallotEntity.findOneBy({ id })
  }
  getByElectionId(election_id: string): Promise<IBallot[]> {
    return BallotEntity.findBy({ election_id })
  }
  async getByIdOrThrow(id: string): Promise<IBallot> {
    const election = await this.getById(id);
    if (!election) {
      throw new InternalError({
        code: "election_id_not_found",
        func: "getByIdOrThrow",
        context: id,
        meta: { id },
        type: ERROR_TYPE.NOT_FOUND
      });
    }
    return election;
  }

  async save(unsaved: IUnsavedBallot): Promise<IBallot> {
    if (!unsaved.created_at) {
      unsaved.created_at = new Date;
    }
    return BallotEntity.save(unsaved as any);
  }
}
