// utils/redis.js
import Redis from 'ioredis';

class RedisClient {
    constructor() {
        this.client = new Redis();
        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }


    isAlive() {
        return this.client.status === 'ready';
    }

    async get(key) {
        try {
            return await this.client.get(key);
        } catch (err) {
            console.error('Error getting value from Redis:', err);
            return null;
        }
    }

    async set(key, value, duration) {
        try {
            await this.client.set(key, value, 'EX', duration);
        } catch (err) {
            console.error('Error setting value in Redis:', err);
        }
    }

    async del(key) {
        try {
            await this.client.del(key);
        } catch (err) {
            console.error('Error deleting value from Redis:', err);
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
