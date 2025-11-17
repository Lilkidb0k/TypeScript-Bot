import { EmbedBuilder, SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags, SeparatorSpacingSize } from "discord.js";
import type { Command } from "../../types/Command.js";
import { emojis } from "../../utils/emojis.js";
import { colors } from "../../utils/colors.js";

export default <Command> {
    name: "ping",
    userInstallable: true,
    slashCommand: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async run(interaction) {

        const start = Date.now();
        const r = await interaction.loading("Pinging...", true);
        const latency = Date.now() - start;

        const container = new ContainerBuilder()
            .setAccentColor(colors.yellow)
            .addTextDisplayComponents(td => td.setContent(`### ${emojis.pong} Pong!`),)
            .addTextDisplayComponents(td => td.setContent(`${emojis.right} **Response Latency:** ${latency}ms`))

        await r.edit({content: null, components: [container], flags: MessageFlags.IsComponentsV2})
    }
}