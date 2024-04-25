import "source-map-support/register";

// 3p
import {
  Config,
  createApp,
  displayServerURL,
  ServiceManager,
} from "@foal/core";

// App
import { ConsumerController } from "./app/controllers/consumer";
import { dataSource } from "./db";
import { DataSource } from "typeorm";
import { AdminController } from "./app/controllers/admin";
import { env } from "./app/util/env";

async function main() {
  await dataSource.initialize();

  const serviceManager = new ServiceManager();
  serviceManager.set(DataSource, dataSource);

  Config.set('settings.bodyParser.limit', '50mb')
  Config.set('settings.multipartRequests.fileSizeLimit', '50mb')
  Config.set('settings.multipartRequests.fileNumberLimit', '10')

  const consumerApp = await createApp(ConsumerController, { serviceManager });
  const adminApp = await createApp(AdminController, { serviceManager });

  const consumerPort = env.consumerApiPort()
  const adminPort = env.adminApiPort()

  consumerApp.listen(consumerPort, () => displayServerURL(consumerPort));
  adminApp.listen(adminPort, () => displayServerURL(adminPort));

}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
