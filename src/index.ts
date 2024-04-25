import "source-map-support/register";

// 3p
import {
  Config,
  createApp,
  displayServerURL,
  ServiceManager,
} from "@foal/core";

// App
import { dataSource } from "./db";
import { DataSource } from "typeorm";
import { env } from "./app/util/env";
import { ApiController } from "./app/controllers";

async function main() {
  await dataSource.initialize();

  const serviceManager = new ServiceManager();
  serviceManager.set(DataSource, dataSource);

  Config.set('settings.bodyParser.limit', '50mb')
  Config.set('settings.multipartRequests.fileSizeLimit', '50mb')
  Config.set('settings.multipartRequests.fileNumberLimit', '10')

  const app = await createApp(ApiController, { serviceManager });

  const port = env.httpPort()

  app.listen(port, () => displayServerURL(port));
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
