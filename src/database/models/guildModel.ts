import { Schema, model, type Document } from "mongoose";

export interface GuildDataModel {
  _id: string;
  prefix: string;
}

export type GuildDocument = GuildDataModel & Document;

const guildSchema = new Schema<GuildDocument>({
  _id: { type: String, required: true },
  prefix: { type: String, default: "!" },
});

guildSchema.virtual("guildId").get(function () {
  return this._id;
});

export const GuildModel = model<GuildDocument>("Guild", guildSchema);
