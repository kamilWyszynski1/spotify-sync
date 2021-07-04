import express, { Router } from "express";
import { RedisClient } from "redis";
import SpotifyWebApi from "spotify-web-api-node";
import { spotifyAuth } from "../controllers/spotifyAuth";

const router = express.Router();

export default (spotify: SpotifyWebApi, redisClient: RedisClient): Router => {
  router.get("/", spotifyAuth(spotify, redisClient));

  return router;
};
