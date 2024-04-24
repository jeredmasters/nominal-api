
import * as dotenv from "dotenv";
dotenv.config()


export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"