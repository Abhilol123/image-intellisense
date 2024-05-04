const Redis = require('redis');

let RedisUtils = {};

RedisUtils.redisClient = Redis.createClient({
    socket: {
        port: process.env.REDIS_PORT ?? 6379,
        host: process.env.REDIS_HOST ?? "localhost"
    }
});

RedisUtils.redisClient.connect();

RedisUtils.setKeyValue = async (key, ttl, value) => {
    try {
        return await RedisUtils.redisClient.setEx(key, ttl, value);
    } catch (err) {
        console.error("RedisUtils.setKeyValue has failed with error " + err);
        return null;
    }
}

RedisUtils.getKeyValue = async (key) => {
    try {
        return await RedisUtils.redisClient.get(key);
    } catch (err) {
        console.error("RedisUtils.getKeyValue has failed with error " + err);
        return null;
    }
}

RedisUtils.pushToQueue = async (key, value) => {
    try {
        return await RedisUtils.redisClient.lPush(key, value);
    } catch (err) {
        console.error("RedisUtils.pushToQueue has failed with error " + err);
        return null;
    }
}

module.exports = RedisUtils;
