import express from "express";
import bodyParser from "body-parser";
import testRouter from "./routes/test.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("hii");
  res.json("hii");
});

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

export { app };
