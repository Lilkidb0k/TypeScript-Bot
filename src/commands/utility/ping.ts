import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/Command";

const command: Command = {
    data: new SlashCommandBuilder()
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

export default command;