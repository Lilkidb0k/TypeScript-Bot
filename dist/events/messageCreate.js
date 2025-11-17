import { Events, quote, bold } from "discord.js";
import { guildData } from "../database/managers/dispatch.js";
export default {
    name: Events.MessageCreate,
    once: false,
    async run(message) {
        if (!message || !message.author || message.author.bot)
            return;
        let content = message.content;
        let prefix = "!";
        if (message.guild) {
            const config = await guildData.get(message.guild.id);
            prefix = config.prefix;
        }
        if (!content.startsWith(prefix))
            return;
        content = content.slice(prefix.length).trim();
        const args = content.split(/\s+/).filter(Boolean);
        const commandName = args[0] ? args[0].toLowerCase() : null;
        if (!commandName)
            return;
        const command = message.client.commands.get(commandName);
        if (!command)
            return;
        if (!command.userInstallable && (!message.guild || !message.member)) {
            return message.fail(`${bold(quote(command.name))} does not function in DM.`);
        }
        ;
        message.client.emit("commandRan", command, message.author);
        try {
            await command.run(message);
        }
        catch (error) {
            console.error(error);
            await message.fail("Whoops..., that didn't work");
        }
    }
};
//# sourceMappingURL=messageCreate.js.map