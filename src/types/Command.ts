import type { ChatInputCommandInteraction, Message, SlashCommandBuilder, } from "discord.js"

export interface Command {
    name: string;
    slashCommand?: SlashCommandBuilder;
    aliases?: string[];
    userInstallable?: boolean,
    run: (interaction: ChatInputCommandInteraction | Message) => Promise<void>;
}