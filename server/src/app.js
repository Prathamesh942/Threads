import express from "express";
import bodyParser from "body-parser";
import testRouter from "./routes/test.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import cookieParser from "cookie-parser";
import commentRouter from "./routes/comment.routes.js";
import cors from "cors";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "https://twinesocial.vercel.app",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("hii");
  res.json("hii");
});

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

export { app };
