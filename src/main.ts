import { prettyLog } from "./utils/logging.js";
prettyLog("BOT", "yellow", "Starting...");

import "dotenv/config";
import "./utils/discordjsExtensions.js";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { connectMongo } from "./database/mongo.js";
import { loadCommands } from "./utils/loadCommands.js";
import { loadEvents } from "./utils/loadEvents.js";
import { loadEmojis, uploadPendingEmojis } from "./utils/emojis.js";

prettyLog("BOT", "yellow", "Creating client...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages
  ],
});

client.commands = new Collection();

(async () => {
  prettyLog("BOT", "yellow", "Connecting database...");
  await connectMongo()
  prettyLog("BOT", "yellow", "Loading commands...");
  await loadCommands(client);
  prettyLog("BOT", "yellow", "Loading events...");
  await loadEvents(client);
  prettyLog("BOT", "yellow", "Loading emojis...");
  await uploadPendingEmojis();
  await loadEmojis()
  prettyLog("BOT", "yellow", "Logging in to client...");
  client.login(process.env.BOT_TOKEN);
})();