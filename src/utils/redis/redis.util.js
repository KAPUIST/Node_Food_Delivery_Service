import redis from 'redis';
//import { REDIS_URL } from '../../constants/env.constant';

// Redis 클라이언트 생성
export const redisClient = redis.createClient({
    url: 'rediss://default:AZ9wAAIncDFkN2Q3OWNmYTI0Njg0YzMwOTA5NjQ3Y2E2NDhmYjc0Y3AxNDA4MTY@stirring-sunbeam-40816.upstash.io:6379',
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
