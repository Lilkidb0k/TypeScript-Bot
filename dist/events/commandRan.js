import { prettyLog } from "../utils/logging.js";
export default {
    name: "commandRan",
    once: false,
    run(command, user) {
        prettyLog("COMMANDS", "blue", `@${user.username} ran ${command.name}`);
    }
};
//# sourceMappingURL=commandRan.js.map