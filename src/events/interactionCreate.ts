import { Events, type Interaction, bold, quote } from "discord.js";
import { prettyLog } from "../utils/logging.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async run(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        };

        if (!command.userInstallable && (!interaction.guild || !interaction.member)) {
            return interaction.fail(`${bold(quote(command.name))} does not function in DM.`);
        };

        interaction.client.emit("commandRan", command, interaction.user);
        
        try {
            await command.run(interaction);
        } catch (error) {
            prettyLog("COMMANDS", "red", `Error occured during command execution: ${error}`);
            await interaction.fail("Whoops..., that didn't work", true);
        }
    }
}