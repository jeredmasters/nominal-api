import { dependency } from "@foal/core";
import { SendgridResource } from "../resource/sendgrid";
import { EventLogRepository } from "../repositories/event_log.repo";
import { VoterRepository } from "../repositories/voter.repo";
import { ElectionRepository } from "../repositories/election.repo";
import { EmailTokenRepository } from "../repositories/email-token.repo";
import { EMAIL_TOKEN_ACTION, EMAIL_TOKEN_STATUS, IEmailToken } from "../repositories/email-token.repo/email-token.entity";
import { env } from "../util/env";
import { EnrollmentInviteProps, LoginInviteProps } from "../domain/enrollment";
import { IVoter } from "../repositories/voter.repo/voter.entity";

export class EmailService {
    @dependency
    sendgridResource: SendgridResource;

    @dependency
    eventLogRepository: EventLogRepository;

    @dependency
    voterRepository: VoterRepository;

    @dependency
    electionRepository: ElectionRepository;

    @dependency
    emailTokenRepository: EmailTokenRepository;

    async sendEnrollmentInvitation(voter: IVoter) {
        const election = await this.electionRepository.getByIdOrThrow(voter.election_id)

        const emailToken = await this.emailTokenRepository.save({
            action: EMAIL_TOKEN_ACTION.SINGLE_VOTE,
            status: EMAIL_TOKEN_STATUS.UNUSED,
            voter_id: voter.id,
            election_id: election.id,
        })

        const invite: EnrollmentInviteProps = {
            email: voter.email,
            first_name: voter.first_name,
            last_name: voter.last_name,
            vote_name: election.label,
            token_url: env.consumerFeUrl() + "/email-token#" + emailToken.id,
            closes_at: election.voting_close_at.toDateString()
        }

        return this.sendgridResource.sendInvite(invite);
    }

    async sendInvitation(emailToken: IEmailToken) {
        const voter = await this.voterRepository.getByIdOrThrow(emailToken.voter_id);

        const invite: LoginInviteProps = {
            email: voter.email,
            first_name: voter.first_name,
            last_name: voter.last_name,
            token_url: env.consumerFeUrl() + "/email-token#" + emailToken.id,
        }

        return this.sendgridResource.sendInvite(invite);
    }


}