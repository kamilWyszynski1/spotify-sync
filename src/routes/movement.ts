import express, { Router } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { addUser, getUsers, join } from "../controllers/movement";

export default (spotify: SpotifyWebApi): Router => {
  const router = express.Router();

  router.post("/", addUser);
  router.get("/", getUsers);
  router.post("/join", join(spotify));

  return router;
};
