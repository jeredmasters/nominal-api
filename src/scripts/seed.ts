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
import { AdminUserRepository } from "../app/repositories/admin-user.repo";
import { AdminPasscodeRepository } from "../app/repositories/admin-passcode.repo";
import { PASSCODE_TYPE } from "../app/repositories/admin-passcode.repo/admin-passcode.entity";

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
    const adminUserRepo = serviceManager.get(AdminUserRepository);
    const adminPasscodeRepo = serviceManager.get(AdminPasscodeRepository);

    const adminUser = await adminUserRepo.save({
        name: "Test Admin",
        email: "admin@example.com"
    })

    const adminPasscode = await adminPasscodeRepo.save({
        admin_user_id: adminUser.id,
        type: PASSCODE_TYPE.PASSWORD,
        value: "asdf1234"
    })

    const org = await organisationRepo.save({
        label: "Test Org",
    })

    console.log(org)

    const election = await electionRepo.save({
        label: "Test ElectionEntity",
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
        first_name: "Test",
        last_name: "Voter",
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
