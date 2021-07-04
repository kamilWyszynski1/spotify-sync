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

export default (spotify: SpotifyWebApi, redisClient: RedisClient): Router => {
  router.get("/recent_tracks", getRecentTracks(spotify));
  router.get("/current", getCurrentlyPlaying(spotify));
  router.get("/track/:id", getTrackByID(spotify));
  router.put("/player", changePlayerState(spotify));
  router.get("/me", getUserData(spotify));
  return router;
};
