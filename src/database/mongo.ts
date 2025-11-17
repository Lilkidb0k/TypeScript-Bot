import "dotenv/config";
import mongoose from "mongoose";
import { prettyLog } from "../utils/logging.js";

export async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI!);
  prettyLog("MONGO", "green", "Mongo database connected")
}