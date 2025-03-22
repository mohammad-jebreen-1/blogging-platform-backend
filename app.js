import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "./src/models/setup.js";

import { StatusCode } from "./src/constants/index.js";
import AppConfigs from "./src/config/config.js";

import { AuthRouter, BlogsRouter, CommentsRouter } from "./src/routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(helmet());
app.use(cors({ origin: AppConfigs.cors.origin }));
app.use((err, req, res, next) => {
  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message, stack: err.stack });
});

app.get("/", (req, res) => {
  res.send("Welcome to the blogging platform backend");
});

app.get("/healthcheck", (req, res) => {
  res.json({
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
  });
});

// Routes
app.use("/auth", AuthRouter);
app.use("/blogs", BlogsRouter);
app.use("/comments", CommentsRouter);

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

try {
  app.listen(AppConfigs.port, (err) => {
    console.log("coonections listening on port", AppConfigs.port);

    if (err) throw err;
  });
} catch (ex) {
  process.exit(-1);
}
