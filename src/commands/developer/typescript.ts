import { Message, EmbedBuilder } from "discord.js";
import type { Command } from "../../types/Command.js";
import { emojis } from "../../utils/emojis.js";
import { colors } from "../../utils/colors.js";

const DEV_ID = "445152230132154380";

export default <Command>{
    name: "typescript",
    userInstallable: false,
    aliases: ["ts", "js"],
    async run(message: Message, args: string[]) {
        if (message.author.id !== DEV_ID) return;

        args.shift()

        let code = args.join(" ");

        code = code.replace(/```(ts|js)?/g, "").trim();

        if (!code) return;

        const originalLog = console.log;
        const logs: string[] = [];
        console.log = (...args) => {
            logs.push(
                args
                    .map(a =>
                        typeof a === "object"
                            ? JSON.stringify(a, null, 2)
                            : String(a)
                    )
                    .join(" ")
            );
        };

        let result: any;
        let success = true;

        try {
            const refMessage = message.reference
                ? await message.fetchReference().catch(() => null)
                : null;

            const sandbox = {
                guild: message.guild,
                me: message.author,
                you: refMessage?.author || null,
                msg: message,
                ref: refMessage,
                emojis,
                colors,
                args,
                log: (...a: any[]) => console.log(...a),
                print: (...a: any[]) => console.log(...a),
                p: (...a: any[]) => console.log(...a),
            };

            const sandboxKeys = Object.keys(sandbox);
            const sandboxValues = Object.values(sandbox);

            const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

            const fn = new AsyncFunction(
                ...sandboxKeys,
                `"use strict"; return (async () => { ${code} })();`
            );

            result = await fn(...sandboxValues);
        } catch (err) {
            success = false;
            result = String(err);
        }
        console.log = originalLog;

        let output = "";
        if (logs.length) output += logs.join("\n");
        if (result !== undefined) {
            if (logs.length) output += "\n";
            output += String(result);
        }
        if (!output) output = "undefined";

        const MAX_LENGTH = 4096;
        const trimmedOutput =
            output.length > MAX_LENGTH
                ? output.slice(0, MAX_LENGTH - 3) + "..."
                : output;

        const embed = new EmbedBuilder()
            .setTitle(success ? `${emojis.success} Code Executed` : `${emojis.error} Error`)
            .addFields(
                { name: "Code", value: `\`\`\`ts\n${code}\`\`\`` },
                { name: "Output", value: `\`\`\`ts\n${trimmedOutput}\`\`\`` }
            )
            .setColor(success ? colors.success : colors.error)

        await message.reply({ embeds: [embed] });
    }
};