import express, { Router } from "express";
import { RedisClient } from "redis";
import SpotifyWebApi from "spotify-web-api-node";
import {
  getRecentTracks,
  getCurrentlyPlaying,
  getTrackByID,
  changePlayerState,
  getUserData,
} from "../controllers/spotify";

const router = express.Router();

export default (redisClient: RedisClient): Router => {
  router.get("/recent_tracks", getRecentTracks(redisClient));
  router.get("/current", getCurrentlyPlaying(redisClient));
  router.get("/track/:id", getTrackByID(redisClient));
  router.put("/player", changePlayerState(redisClient));
  router.get("/me", getUserData(redisClient));
  return router;
};
