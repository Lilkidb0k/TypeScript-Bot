import { CommandInteraction, Message, MessageFlags, ContainerBuilder } from "discord.js";
import { prettyLog } from './logging.js';
import { emojis } from './emojis.js'

CommandInteraction.prototype.success = async function (content, ephemeral) {
    const payload = {content: `${emojis.success} ${content}`, ...(ephemeral && {flags: MessageFlags.Ephemeral})}

    if (this.deferred || this.replied) {
        return this.editReply(payload);
    } else {
        return this.reply(payload);
    }
};

CommandInteraction.prototype.warning = async function (content, ephemeral) {
    const payload = {content: `${emojis.warning} ${content || ""}`, ...(ephemeral && {flags: MessageFlags.Ephemeral})}

    if (this.deferred || this.replied) {
        return this.editReply(payload);
    } else {
        return this.reply(payload);
    }
};

CommandInteraction.prototype.fail = async function (content, ephemeral) {
    const payload = {content: `${emojis.fail} ${content}`, ...(ephemeral && {flags: MessageFlags.Ephemeral})}

    if (this.deferred || this.replied) {
        return this.editReply(payload);
    } else {
        return this.reply(payload);
    }
};

CommandInteraction.prototype.loading = async function (content, ephemeral) {
    const payload = {content: `${emojis.loading} ${content || ""}`, ...(ephemeral && {flags: MessageFlags.Ephemeral})}

    if (this.deferred || this.replied) {
        return this.editReply(payload);
    } else {
        return this.reply(payload);
    }
};

Message.prototype.success = async function (content) {
    const payload = {content: `${emojis.success} ${content}`}

    return this.reply(payload);
};

Message.prototype.warning = async function (content) {
    const payload = {content: `${emojis.warning} ${content}`}

    return this.reply(payload);
};

Message.prototype.fail = async function (content) {
    const payload = {content: `${emojis.fail} ${content}`}

    return this.reply(payload);
};

Message.prototype.loading = async function (content) {
    const payload = {content: `${emojis.loading} ${content || ""}`}

    return this.reply(payload);
};

prettyLog("EXT", "green", "discord.js extensions injected")