export interface LoginInviteProps {
    "first_name": string;
    "last_name": string;
    "email": string;
    "token_url": string;
}

export interface EnrollmentInviteProps extends LoginInviteProps {
    "closes_at": string;
    "vote_name": string;
}