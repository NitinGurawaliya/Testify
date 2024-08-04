import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import userRouter from './router/user.Router';
import adminRouter from './router/admin.Router';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
