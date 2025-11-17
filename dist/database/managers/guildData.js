import { GuildModel } from "../models/guildModel.js";
export class GuildDataManager {
    cache = new Map();
    ttl = 1000 * 60 * 15; // 15 minutes
    now() {
        return Date.now();
    }
    setCache(guildId, data) {
        this.cache.set(guildId, {
            data,
            expires: this.now() + this.ttl
        });
    }
    getFromCache(guildId) {
        const entry = this.cache.get(guildId);
        if (!entry)
            return null;
        if (this.now() > entry.expires) {
            this.cache.delete(guildId);
            return null;
        }
        return entry.data;
    }
    async get(guildId) {
        const cached = this.getFromCache(guildId);
        if (cached)
            return cached;
        let data = await GuildModel.findById(guildId);
        if (!data)
            data = await GuildModel.create({ _id: guildId });
        this.setCache(guildId, data);
        return data;
    }
    async update(guildId, update) {
        const data = await GuildModel.findByIdAndUpdate(guildId, { $set: update }, { new: true, upsert: true });
        this.setCache(guildId, data);
        return data;
    }
    async save(data) {
        await data.save();
        this.setCache(data._id, data);
        return data;
    }
    deleteFromCache(guildId) {
        this.cache.delete(guildId);
    }
}
//# sourceMappingURL=guildData.js.map