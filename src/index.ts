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

const log: Logger = createLogger("index");
dotenv.config();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5000/callback",
});

app.use("/test", testRouter);
app.use("/callback", spotifyAuthRouter(spotifyApi));
app.use("/spotify", spotifyClientRouter(spotifyApi));
app.use("/user", userRouter);

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
];
const state = "state";

log.info(spotifyApi.createAuthorizeURL(scopes, state));

log.info("starting server");

app.listen(port, () => log.info(`Running on port ${port}`));

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});
