import express, { Router } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import {
  getRecentTracks,
  getCurrentlyPlaying,
  getTrackByID,
  changePlayerState,
} from "../controllers/spotify";

const router = express.Router();

export default (spotify: SpotifyWebApi): Router => {
  router.get("/recent_tracks", getRecentTracks(spotify));
  router.get("/current", getCurrentlyPlaying(spotify));
  router.get("/track/:id", getTrackByID(spotify));
  router.put("/player", changePlayerState(spotify));
  return router;
};
