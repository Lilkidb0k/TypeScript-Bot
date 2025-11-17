import { type Client, Events } from "discord.js";
import { prettyLog } from "../utils/logging.js";

export default {
    name: Events.ClientReady,
    once: true,
    run(client: Client) {
        prettyLog("BOT", "yellow", `Client ready with user @${client.user.username}`)
    }
}