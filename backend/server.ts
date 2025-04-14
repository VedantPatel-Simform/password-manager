import express from 'express';
import 'dotenv/config'; // new syntax
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { initDB } from './configs/db.config.js';
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
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

app.use('/authentication', authRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('server started at', PORT);
    initDB();
});
