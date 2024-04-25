import { ServiceManager } from "@foal/core";
import { DataSource } from "typeorm";
import { dataSource } from "../db";
import { SendgridResource } from "../app/resource/sendgrid";

export async function main() {
    await dataSource.initialize();
    const serviceManager = new ServiceManager();
    serviceManager.set(DataSource, dataSource)

    const sendgridResource = serviceManager.get(SendgridResource);

    const response = await sendgridResource.sendInvite({
        closes_at: "28/Apr/2024",
        first_name: "Jered",
        last_name: "Masters",
        email: "jered.masters@outlook.com",
        token_url: "http://localhost/asdf",
        vote_name: "AGM"
    });
    console.log(response)

}