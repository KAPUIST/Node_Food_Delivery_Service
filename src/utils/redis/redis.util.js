import redis from 'redis';
import { ENV_CONS } from '../../constants/env.constant.js';

// Redis 클라이언트 생성
export const redisClient = redis.createClient({
    url: ENV_CONS.REDIS_URL,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export async function initializeRedis() {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully.');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}
