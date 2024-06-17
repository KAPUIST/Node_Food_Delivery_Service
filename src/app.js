import express from 'express';
import 'dotenv/config';
import router from './routers/index.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello world!!');
});

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
