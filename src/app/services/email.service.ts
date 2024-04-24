import { dependency } from "@foal/core";
import { SendgridResource } from "../resource/sendgrid";
import { EventLogRepository } from "../repositories/event_log.repo";
import { IEnrollment } from "../repositories/enrollment.repo/enrollment.entity";
import { VoterRepository } from "../repositories/voter.repo";
import { ElectionRepository } from "../repositories/election.repo";
import { InviteProps } from "../domain/enrollment";
import { EmailTokenRepository } from "../repositories/email-token.repo";
import { EMAIL_TOKEN_ACTION, EMAIL_TOKEN_STATUS } from "../repositories/email-token.repo/email-token.entity";
import { FRONTEND_URL } from "../const/config";

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

    async sendInvitation(enrollment: IEnrollment) {
        const voter = await this.voterRepository.getByIdOrThrow(enrollment.voter_id)
        const election = await this.electionRepository.getByIdOrThrow(enrollment.election_id)

        const emailToken = await this.emailTokenRepository.save({
            action: EMAIL_TOKEN_ACTION.SINGLE_VOTE,
            status: EMAIL_TOKEN_STATUS.UNUSED,
            voter_id: voter.id,
            election_id: election.id,
        })

        const invite: InviteProps = {
            email: voter.email,
            first_name: voter.first_name,
            last_name: voter.last_name,
            vote_name: election.label,
            token_url: FRONTEND_URL + "/email-token?t=" + emailToken.id,
            closes_at: election.closes_at.toDateString()
        }

        return this.sendgridResource.sendInvite(invite);
    }
}