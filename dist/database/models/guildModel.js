import { Schema, model } from "mongoose";
const guildSchema = new Schema({
    _id: { type: String, required: true },
    prefix: { type: String, default: "!" },
});
guildSchema.virtual("guildId").get(function () {
    return this._id;
});
export const GuildModel = model("Guild", guildSchema);
//# sourceMappingURL=guildModel.js.map