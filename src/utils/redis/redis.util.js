import redis from 'redis';
import { REDIS_URL } from '../../constants/env.constant';

// Redis 클라이언트 생성
export const redisClient = redis.createClient({
    url: REDIS_URL,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Redis 연결 준비
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully.');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();
