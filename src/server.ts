import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config/mongoconfig';
import mongoose from 'mongoose';
import v1 from './routes/v1';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
export default mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Mongodb connected');
    })
    .catch((err) => console.log(err));

app.use('/v1', v1);

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
