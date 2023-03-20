import { CacheManagerService } from "@/services";

describe("Cache Manager Service", () => {
  it("should set value in cache", async () => {
    const cacheManager = new CacheManagerService();

    await cacheManager.set("key1", "value1");
    await cacheManager.set("key2", "value2");

    expect(cacheManager.get("key1")).resolves.toBe("value1");
    expect(cacheManager.get("key2")).resolves.toBe("value2");
  });

  it("should delete a value from cache", async () => {
    const cacheManager = new CacheManagerService();

    await cacheManager.set("key1", "value1");
    await cacheManager.delete("key1");

    expect(cacheManager.get("key1")).resolves.toBe(undefined);
  });
});
