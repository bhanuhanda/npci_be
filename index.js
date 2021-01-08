import express from 'express';
import userRouter from './routes/userRouter.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// setup express
const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

// setup mongoose
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('db is connected');
  }
})
