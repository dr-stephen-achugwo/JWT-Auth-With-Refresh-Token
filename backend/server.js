import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
dotenv.config();
import connectDb from "./src/config/connect.js";
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

const server = app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`Server is running on port http://localhost:${PORT}`);
  } catch (error) {
    console.log(error, "Server is not running");
  }
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

export default server;
