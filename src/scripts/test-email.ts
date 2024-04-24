import { ServiceManager } from "@foal/core";
import { DataSource } from "typeorm";
import { dataSource } from "../db";
import { SendgridResource } from "../app/resource/sendgrid";
import { SENDGRID_API_KEY } from "../app/const/config";

export async function main() {
    await dataSource.initialize();
    const serviceManager = new ServiceManager();
    serviceManager.set(DataSource, dataSource)

    const sendgridResource = serviceManager.get(SendgridResource);
    console.log({ SENDGRID_API_KEY })

    const response = await sendgridResource.sendInvite({
        closes_at: "28/Apr/2024",
        first_name: "Jered",
        last_name: "Masters",
        email: "jered.masters@outlook.com",
        token_url: "http://localhost/asdf",
        vote_name: "AGM"
    });
    console.log(response.status)
    console.log(response.data)

}