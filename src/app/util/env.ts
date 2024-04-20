require('dotenv').config();

export class Env {
  raw: any;
  constructor(raw: any) {
    this.raw = raw;
  }

  private _str(label: ENV, fallback: string | null = null): string | null {
    if (label in this.raw) {
      return this.raw[label];
    }
    return fallback;
  }

  private _num(label: ENV, fallback: number | null = null): number | null {
    if (label in this.raw) {
      return Number(this.raw[label]);
    }
    return fallback;
  }

  dbHost() {
    return this._str(ENV.DB_HOST);
  }
  dbName() {
    return this._str(ENV.DB_NAME);
  }
  dbUser() {
    return this._str(ENV.DB_USER);
  }
  dbPass() {
    return this._str(ENV.DB_PASS);
  }
  dbPort() {
    return this._num(ENV.DB_PORT, 5432);
  }
}

export const env = new Env(process.env);

export enum ENV {
  DB_HOST = 'DB_HOST',
  DB_NAME = 'DB_NAME',
  DB_USER = 'DB_USER',
  DB_PASS = 'DB_PASS',
  DB_PORT = 'DB_PORT',
}
