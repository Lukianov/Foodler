import express from 'express';
import dotenv from 'dotenv';
import { telegramAuth } from './middleware/telegramAuth';
import { limiter } from './middleware/limiter';
import { uploadRouter } from './routes/upload';
import { diaryRouter } from './routes/diary';
import { stripeRouter } from './routes/stripe';

dotenv.config();

const app = express();
app.use(express.json());

app.use(telegramAuth);

app.use('/api/upload', limiter, uploadRouter);
app.use('/api/diary', diaryRouter);
app.use('/webhooks/stripe', stripeRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
