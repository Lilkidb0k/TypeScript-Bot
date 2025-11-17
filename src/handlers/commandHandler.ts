import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import * as path from "path";
import { Command } from "../types/Command";
import { ExtendedClient } from "../types/ExtendedClient";

export async function loadCommands(client: ExtendedClient) {
    const commands: Command[] = [];
    const commandsPath = path.join(__dirname, "..", "commands");

    function loadFolder(folder: string) {
        const items = readdirSync(folder, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(folder, item.name);

            if (item.isDirectory()) {
                loadFolder(fullPath);
            } else if (item.name.endsWith(".ts") || item.name.endsWith(".js")) {
                const command: Command = require(fullPath).default;
                commands.push(command);
                client.commands.set(command.data.name, command);

                if (command.prefix) {
                    client.commands.set(command.prefix, command);
                }
            }
        }
    }

    loadFolder(commandsPath);
    return commands;
}

export async function registerCommands(client: ExtendedClient, commands: Command[]) {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: commands.map(cmd => cmd.data.toJSON()) }
    );

    console.log("Commands registered.");
}
