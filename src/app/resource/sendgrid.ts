import axios from "axios";
import { env } from "../util/env";
import { ERROR_TYPE, InternalError } from "../domain/error";
import { EnrollmentInviteProps, LoginInviteProps } from "../domain/enrollment";


/*
curl -X "POST" "https://api.sendgrid.com/v3/mail/send" \
     -H 'Authorization: Bearer <<YOUR_API_KEY>>' \
     -H 'Content-Type: application/json' \
     -d '{
   "from":{
      "email":"example@.sendgrid.net"
   },
   "personalizations":[
      {
         "to":[
            {
               "email":"example@sendgrid.net"
            }
         ],
         "dynamic_template_data":{
            "total":"$ 239.85",
            "items":[
               {


*/
export interface ISendgridResult {
    success: boolean;
    meta: any;
    reason?: string;
}
export class SendgridResource {
    async sendInvite(props: LoginInviteProps | EnrollmentInviteProps): Promise<ISendgridResult> {
        return this.sendEmail("d-5544f1871e064453b4ec4a0905df6e28", props.email, props)
    }
    async sendEmail(templateId: string, email: string, props: any): Promise<ISendgridResult> {
        console.log("SEND EMAIL", props)

        if (email.endsWith('@example.com')) {
            console.log("SKIP TEST EMAIL", email)
            return Promise.resolve({
                success: true,
                meta: props,
                reason: "skip_example"
            })
        }
        const apiKey = env.sendgridApiKey();
        const sender = env.sendgridSender();
        if (!apiKey || !sender) {
            return Promise.resolve({
                success: false,
                meta: { apiKey, sender },
                reason: "not_configured"
            })
        }
        return axios({
            method: "post",
            url: "https://api.sendgrid.com/v3/mail/send",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: {
                "from": {
                    "email": sender
                },
                "template_id": templateId,
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": email
                            }
                        ],
                        "dynamic_template_data": props
                    }
                ]
            }
        }).then((response): ISendgridResult => {
            console.log(response);
            console.log(response.data);
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    meta: response.data,
                }
            }
            throw new InternalError({
                code: "sendgrid_failed",
                func: "sendInvite",
                type: ERROR_TYPE.UNKOWN,
                meta: { apiKey, sender },
                context: response.status.toString(),
                inner: response.data
            })
        }).catch(e => {
            console.error(e)
            console.error(e.response.status)
            console.error(e.response.data)
            throw new InternalError({
                code: "sendgrid_failed",
                func: "sendInvite",
                type: ERROR_TYPE.UNKOWN,
                meta: { apiKey, sender },
                inner: e.response.data
            })
        })
    }
}