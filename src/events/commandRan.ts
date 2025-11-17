import { Events, type User } from "discord.js";
import { prettyLog } from "../utils/logging.js";
import type { Command } from "../types/Command.js";

export default {
    name: "commandRan",
    once: false,
    run(command: Command, user: User) {
        prettyLog("COMMANDS", "blue", `@${user.username} ran ${command.name}`)
    }
}