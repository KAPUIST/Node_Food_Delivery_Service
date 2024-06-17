import express from 'express';
import 'dotenv/config';
import router from './routers/index.js';
import { initializeRedis } from './utils/redis/redis.util.js';
const app = express();
const PORT = process.env.PORT;

(async () => {
    await initializeRedis();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello world!!');
});

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
