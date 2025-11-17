import type { ChatInputCommandInteraction, Message, SlashCommandBuilder, } from "discord.js"

export interface Command {
    name: string;
    slashCommand?: SlashCommandBuilder;
    userInstallable?: boolean,
    run: (interaction: ChatInputCommandInteraction | Message) => Promise<void>;
}