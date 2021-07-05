import { Request, Response } from "express";
import { createClient } from "redis";
import SpotifyWebApi from "spotify-web-api-node";
import createLogger from "../utils/logger";

const logger = createLogger("controller:movement");
let users: Array<string> = new Array<string>();

const addUser = (req: Request, resp: Response) => {
  const userName: string = generateName(6);
  users.push(userName);

  resp.status(201).send({ user: userName });
};

const getUsers = (req: Request, resp: Response) => {
  resp.status(200).send({ users: users });
};

const join = (req: Request, resp: Response) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:5000/callback`,
  });

  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-read-playback-state",
  ];
  const state = "state";

  resp.status(200).send({ uri: spotifyApi.createAuthorizeURL(scopes, state) });
};

function generateName(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { addUser, getUsers, join };
