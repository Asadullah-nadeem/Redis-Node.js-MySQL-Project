const redis = require('../config/redis');

class CacheService {
  static async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key, value, ttl = 3600) {
    await redis.set(key, JSON.stringify(value), { EX: ttl });
  }

  static async del(key) {
    await redis.del(key);
  }

  static async clearPattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(keys);
    }
  }
}

module.exports = CacheService;