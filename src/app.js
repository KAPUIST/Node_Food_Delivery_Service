import express from 'express';
import 'dotenv/config';
import router from './routers/index.js';
import { errorHandler } from './middlewares/error-handler-middleware.js';
import { initializeRedis } from './utils/redis/redis.util.js';
import { initializeWebSocket } from './utils/websocket/websocket.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello world!!');
});
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
initializeWebSocket(server);
