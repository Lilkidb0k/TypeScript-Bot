import { Events, type ChatInputCommandInteraction, type Interaction, bold, quote } from "discord.js";
import { prettyLog } from "../utils/logging.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async run(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const args: string[] = interaction.options.data.map(opt => String(opt.value));
        const commandName = interaction.commandName.toLowerCase();

        // Find command by name or alias
        const command =
            interaction.client.commands.get(commandName) ||
            interaction.client.commands.find(cmd => cmd.aliases?.includes(commandName));

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (!command.userInstallable && (!interaction.guild || !interaction.member)) {
            return interaction.reply({
                content: `${bold(quote(command.name))} does not function in DM.`,
                ephemeral: true
            });
        }

        interaction.client.emit("commandRan", command, interaction.user);

        try {
            await command.run(interaction, args);
        } catch (error) {
            prettyLog("COMMANDS", "red", `Error occurred during command execution: ${error}`);
            await interaction.reply({ content: "Whoops..., that didn't work", ephemeral: true });
        }
    }
};