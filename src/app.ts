import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", router);

export = app;
