import express from "express";
import { Logger } from "winston";
import { router as testRouter } from "./routes/test";
import spotifyAuthRouter from "./routes/spotifyAuth";
import spotifyClientRouter from "./routes/spotify";
import createLogger from "./utils/logger";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import { router as userRouter } from "./routes/movement";
import cors from "cors";
import { createClient } from "redis";

const log: Logger = createLogger("index");
dotenv.config();
const app = express();
const port = 5000;
const redisClient = createClient("6379");

app.use(express.json());
app.use(cors());

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5000/callback",
});

app.use("/test", testRouter);
app.use("/callback", spotifyAuthRouter(spotifyApi, redisClient));
app.use("/spotify", spotifyClientRouter(redisClient));
app.use("/user", userRouter);

log.info("starting server");

process.once("SIGUSR2", function () {
  process.exit();
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  // process.kill(process.pid, "SIGINT");
  log.info("killing process on CTRL+C");
  process.exit();
});

app.listen(port, () => log.info(`Running on port ${port}`));
