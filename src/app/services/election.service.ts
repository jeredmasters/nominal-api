import { dependency } from "@foal/core";
import { ElectionRepository } from "../repositories/election.repo";
import { RunningRepository } from "../repositories/running.repo";

export class ElectionService {
    @dependency
    electionRepository: ElectionRepository;

    @dependency
    runningRepository: RunningRepository;

} 