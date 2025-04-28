import express from 'express';
import 'dotenv/config'; // new syntax
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { initDB } from './configs/db.config.js';
import router from './routes/Routes.js';
import morgan from 'morgan';
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan('tiny'));

app.use('/api', router);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('server started at', PORT);
    initDB();
});
