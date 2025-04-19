const User = require('../models/User');
const CacheService = require('./cacheService');

class UserService {
  static async getUsers({ page, limit, search }) {
    const cacheKey = `users:page:${page}:limit:${limit}:search:${search}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const data = await User.findAll({ page, limit, search });
    await CacheService.set(cacheKey, data);
    
    return data;
  }

  static async getUserById(id) {
    const cacheKey = `user:${id}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const user = await User.findById(id);
    if (user) {
      await CacheService.set(cacheKey, user);
    }
    
    return user;
  }
}

module.exports = UserService;