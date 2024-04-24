import axios from "axios";
import { SENDGRID_API_KEY } from "../const/config";
import { InviteProps } from "../domain/enrollment";


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
export class SendgridResource {


    async sendInvite(props: InviteProps) {

        return axios({
            method: "post",
            url: "https://api.sendgrid.com/v3/mail/send",
            headers: {
                Authorization: `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                "from": {
                    "email": "me@jered.cc"
                },
                "template_id": "d-5544f1871e064453b4ec4a0905df6e28",
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": props.email
                            }
                        ],
                        "dynamic_template_data": props
                    }
                ]
            }
        }).catch(e => {
            console.error(e)
            console.error(e.response.status)
            console.error(e.response.data)
            return e.response
        })
    }
}