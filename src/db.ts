import { Config } from "@foal/core";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { env } from "./app/util/env";
dotenv.config()

export function createDataSource(): DataSource {
  return new DataSource({
    name: "default",

    type: 'postgres',

    host: env.dbHost(),
    port: env.dbPort(),
    username: env.dbUser(),
    password: env.dbPass(),
    database: env.dbName(),

    entities: ["build/app/**/*.entity.js"],
    migrations: ["build/migrations/*.js"],
  });
}

export const dataSource = createDataSource();
