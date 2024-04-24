import { Config } from "@foal/core";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
dotenv.config()

const getConf = (name: string) => {
  return process.env[name]
}

const getEnvNum = (name: string) => {
  return Number(getConf(name))
}

export function createDataSource(): DataSource {
  return new DataSource({
    name: "default",

    type: 'postgres',

    host: getConf('DB_HOST'),
    port: getEnvNum('DB_PORT'),
    username: getConf('DB_USER'),
    password: getConf('DB_PASS'),
    database: getConf('DB_NAME'),

    entities: ["build/app/**/*.entity.js"],
    migrations: ["build/migrations/*.js"],
  });
}

export const dataSource = createDataSource();
