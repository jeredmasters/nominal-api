import { env } from "../util/env";


export const typeOrmConfig = {
    type: "postgres",
    host: env.dbHost(),
    port: env.dbPort(),
    username: env.dbUser(),
    password: env.dbPass(),
    database: env.dbName(),
    synchronize: false,
    migrations: ["dist/migrations/**/*{.ts,.js}"],
    subscribers: ["dist/subscriber/**/*{.ts,.js}"]
};
