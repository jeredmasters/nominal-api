import "source-map-support/register";

// 3p
import {
  Config,
  createApp,
  displayServerURL,
  ServiceManager,
} from "@foal/core";

// App
import { ApiController } from "./app/controllers";
import { dataSource } from "./db";
import { DataSource } from "typeorm";

async function main() {
  await dataSource.initialize();

  const serviceManager = new ServiceManager();
  serviceManager.set(DataSource, dataSource);

  Config.set('settings.bodyParser.limit', '50mb')
  Config.set('settings.multipartRequests.fileSizeLimit', '50mb')
  Config.set('settings.multipartRequests.fileNumberLimit', '10')

  const app = await createApp(ApiController, { serviceManager });

  const port = Config.get("port", "number", 4000);
  app.listen(port, () => displayServerURL(port));
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
