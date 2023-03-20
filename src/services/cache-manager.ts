import { MemoryCache, caching } from "cache-manager";

export class CacheManagerService {
  private cache: MemoryCache;

  async setup() {
    if (!this.cache) {
      const cache = await caching("memory");
      this.cache = cache;
    }
  }

  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    await this.setup();
    this.cache.set(key, value);
  }

  async get(key: string): Promise<any> {
    await this.setup();
    return this.cache.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.setup();
    return this.cache.del(key);
  }
}
