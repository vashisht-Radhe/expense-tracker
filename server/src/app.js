import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler } from "./utils/apiUtils.js";

import router from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.use("/api", router);

app.use(errorHandler);

export default app;
