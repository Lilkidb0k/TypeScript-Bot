import "dotenv/config";
import {
    Client,
    GatewayIntentBits,
    Collection
} from "discord.js";

import { loadCommands, registerCommands } from "./handlers/commandHandler";

const PREFIX = "!";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
}) as Client & { commands: Collection<string, any> };

client.commands = new Collection();

client.once("clientReady", async () => {
    console.log(`${client.user?.tag} is online`);

    const commands = await loadCommands(client);
    await registerCommands(client, commands);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: "Error executing command.",
            ephemeral: true
        });
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command || !command.executePrefix) return;

    try {
        await command.executePrefix(message, args);
    } catch (err) {
        console.error(err);
        await message.reply("An error occurred while executing that command.");
    }
});

client.login(process.env.TOKEN);