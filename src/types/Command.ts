import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Message
} from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;

    prefix?: string;
    executePrefix?: (message: Message, args: string[]) => Promise<void>;
}