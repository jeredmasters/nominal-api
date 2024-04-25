require('dotenv').config();

export class EnvConf {
  raw: any;
  constructor(raw?: any) {
    this.raw = raw || process.env
  }

  private _str(label: ENV, fallback: string): string {
    if (label in this.raw) {
      return this.raw[label];
    }
    return fallback;
  }

  private _strN(label: ENV, fallback: string | null = null): string | null {
    if (label in this.raw) {
      return this.raw[label];
    }
    return fallback;
  }

  private _num(label: ENV, fallback: number): number {
    if (label in this.raw) {
      return Number(this.raw[label]);
    }
    return fallback;
  }
  private _numN(label: ENV, fallback: number | null = null): number | null {
    if (label in this.raw) {
      return Number(this.raw[label]);
    }
    return fallback;
  }
  adminApiPort() {
    return this._num(ENV.ADMIN_API_PORT, 4001);
  }
  consumerApiPort() {
    return this._num(ENV.CONSUMER_API_PORT, 4000);
  }
  dbHost() {
    return this._str(ENV.DB_HOST, "localhost");
  }
  dbName() {
    return this._str(ENV.DB_NAME, "nominal");
  }
  dbUser() {
    return this._str(ENV.DB_USER, "nominal");
  }
  dbPass() {
    return this._str(ENV.DB_PASS, "nominal");
  }
  dbPort() {
    return this._num(ENV.DB_PORT, 5432);
  }
  sendgridApiKey() {
    return this._strN(ENV.SENDGRID_API_KEY)
  }
  sendgridSender() {
    return this._strN(ENV.SENDGRID_EMAIL)
  }
  consumerFeUrl() {
    return this._str(ENV.SENDGRID_API_KEY, "http://localhost:3000")
  }
}

export const env = new EnvConf();

export enum ENV {
  DB_HOST = 'DB_HOST',
  DB_NAME = 'DB_NAME',
  DB_USER = 'DB_USER',
  DB_PASS = 'DB_PASS',
  DB_PORT = 'DB_PORT',
  SENDGRID_API_KEY = 'SENDGRID_API_KEY',
  SENDGRID_EMAIL = 'SENDGRID_EMAIL',
  CONSUMER_FE_URL = 'CONSUMER_FE_URL',
  CONSUMER_API_PORT = 'CONSUMER_API_PORT',
  ADMIN_API_PORT = 'ADMIN_API_PORT'
}
