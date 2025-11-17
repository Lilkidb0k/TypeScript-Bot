import { Events } from "discord.js";
import { prettyLog } from "../utils/logging.js";
export default {
    name: Events.ClientReady,
    once: true,
    run(client) {
        prettyLog("BOT", "yellow", `Client ready with user @${client.user.username}`);
    }
};
//# sourceMappingURL=clientReady.js.map