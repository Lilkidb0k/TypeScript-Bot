import { GuildModel, type GuildDocument } from "../models/guildModel.js";

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export class GuildDataManager {
  private cache = new Map<string, CacheEntry<GuildDocument>>();
  private ttl = 1000 * 60 * 15; // 15 minutes

  private now() {
    return Date.now();
  }

  private setCache(guildId: string, data: GuildDocument) {
    this.cache.set(guildId, {
      data,
      expires: this.now() + this.ttl
    });
  }

  private getFromCache(guildId: string) {
    const entry = this.cache.get(guildId);
    if (!entry) return null;

    if (this.now() > entry.expires) {
      this.cache.delete(guildId);
      return null;
    }

    return entry.data;
  }

  async get(guildId: string) {
    const cached = this.getFromCache(guildId);
    if (cached) return cached;

    let data = await GuildModel.findById(guildId);
    if (!data) data = await GuildModel.create({ _id: guildId });

    this.setCache(guildId, data);
    return data;
  }

  async update(guildId: string, update: object) {
    const data = await GuildModel.findByIdAndUpdate(
      guildId,
      { $set: update },
      { new: true, upsert: true }
    );

    this.setCache(guildId, data!);
    return data!;
  }

  async save(data: GuildDocument) {
    await data.save();
    this.setCache(data._id, data);
    return data;
  }

  deleteFromCache(guildId: string) {
    this.cache.delete(guildId);
  }
}