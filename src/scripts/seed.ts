import { ServiceManager } from "@foal/core";
import { dataSource } from "../db";
import { DataSource } from "typeorm";
import { OrganisationRepository } from "../app/repositories/organisation.repo";
import { ElectionRepository } from "../app/repositories/election.repo";
import { ELECTION_TYPE } from "../app/const/election";
import { CandidateRepository } from "../app/repositories/candidate.repo";
import { VoterRepository } from "../app/repositories/voter.repo";
import { EmailTokenRepository } from "../app/repositories/email-token.repo";
import { EMAIL_TOKEN_ACTION, EMAIL_TOKEN_STATUS } from "../app/repositories/email-token.repo/email-token.entity";

export async function main() {
    console.log("SEED")

    await dataSource.initialize();
    const serviceManager = new ServiceManager();
    serviceManager.set(DataSource, dataSource)

    const organisationRepo = serviceManager.get(OrganisationRepository);
    const electionRepo = serviceManager.get(ElectionRepository);
    const candidateRepo = serviceManager.get(CandidateRepository);
    const voterRepo = serviceManager.get(VoterRepository);
    const emailTokenRepo = serviceManager.get(EmailTokenRepository);

    const org = await organisationRepo.save({
        label: "Test Org",
    })

    console.log(org)

    const election = await electionRepo.save({
        label: "Test Election",
        organisation_id: org.id,
        type: ELECTION_TYPE.PREFERENCE
    })

    console.log(election)

    const candidates = await Promise.all([
        {
            label: "Test AA",
            election_id: election.id
        }
    ].map(candidateRepo.save))

    const voter = await voterRepo.save({
        first_name: "Jered",
        last_name: "Masters",
        organisation_id: org.id
    })

    const emailToken = await emailTokenRepo.save({
        action: EMAIL_TOKEN_ACTION.LOGIN,
        status: EMAIL_TOKEN_STATUS.UNUSED,
        voter_id: voter.id
    })

    console.log(candidates);
    console.log(emailToken)

    dataSource.destroy();
}
