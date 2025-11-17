"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
    prefix: "ping",
    async executePrefix(message) {
        await message.reply("Pong!");
    }
};
exports.default = command;
