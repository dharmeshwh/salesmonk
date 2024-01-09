import express from "express";
import router from "./routes";
import cors from "cors";
import { configDotenv } from "dotenv";
import path from "path";

const app = express();

configDotenv({ path: path.join(__dirname, "/../.env") });

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", router);

export = app;
