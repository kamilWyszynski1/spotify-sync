import { Logger } from "winston";
import createLogger from "../utils/logger";
import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { RedisClient } from "redis";

const logger: Logger = createLogger("controller:spotifyAuth");

const spotifyAuth = (
  spotify: SpotifyWebApi,
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return (req: Request, resp: Response) => {
    const code: string = (req.query as any).code;

    const hash: string = generateHash(12);

    // Retrieve an access token and a refresh token
    spotify.authorizationCodeGrant(code).then(
      function (data) {
        console.log("The token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        console.log("The refresh token is " + data.body["refresh_token"]);

        logger.info(`writing access keys to redis`);
        redisClient.set(
          hash,
          JSON.stringify({
            accessToken: data.body["access_token"],
            refreshToken: data.body["refresh_token"],
          }),
          (err: Error, reply: string) => {
            if (err) {
              resp.status(500).send({ msg: "failed to authenticate" });
            } else {
              resp.status(200).send({ key: hash });
            }
          }
        );
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };
};

function generateHash(length: number): string {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { spotifyAuth };
