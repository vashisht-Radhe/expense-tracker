import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5500;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
