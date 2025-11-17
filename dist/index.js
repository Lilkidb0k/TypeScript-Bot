"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const commandHandler_1 = require("./handlers/commandHandler");
const PREFIX = "!";
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.commands = new discord_js_1.Collection();
client.once("clientReady", async () => {
    console.log(`${client.user?.tag} is online`);
    const commands = await (0, commandHandler_1.loadCommands)(client);
    await (0, commandHandler_1.registerCommands)(client, commands);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (err) {
        console.error(err);
        await interaction.reply({
            content: "Error executing command.",
            ephemeral: true
        });
    }
});
client.on("messageCreate", async (message) => {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(PREFIX))
        return;
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName)
        return;
    const command = client.commands.get(commandName);
    if (!command || !command.executePrefix)
        return;
    try {
        await command.executePrefix(message, args);
    }
    catch (err) {
        console.error(err);
        await message.reply("An error occurred while executing that command.");
    }
});
client.login(process.env.TOKEN);
