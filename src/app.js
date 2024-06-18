import express from 'express';
import 'dotenv/config';
import http from 'http';
import router from './routers/index.js';
import { errorHandler } from './middlewares/error-handler-middleware.js';
import { initializeRedis } from './utils/redis/redis.util.js';
import { initializeWebSocket } from './utils/websocket/websocket.js';
const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
    await initializeRedis();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello world!!');
});
app.use(errorHandler);

// HTTP 서버 생성 및 Express 앱과 연결

// WebSocket 서버 초기화

const server = app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
initializeWebSocket(server);
