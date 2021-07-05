import { Logger } from "winston";
import createLogger from "../utils/logger";
import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { RedisClient } from "redis";
import SpotifyCredentials from "../models/spotify";
import { promisify } from "util";

/// <reference types="spotify-api" />

interface SpotifyResponse<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

const logger: Logger = createLogger("controller:spotify");

async function spotifyClientFromRedis(
  key: string,
  redisClient: RedisClient
): Promise<SpotifyWebApi> {
  const getAsync = promisify(redisClient.get).bind(redisClient);

  try {
    const reply = await getAsync(key);

    logger.info(`spotifyClientFromRedis: reply value: ${reply}`);
    if (reply == "" || reply == null) {
      throw new Error("no saved credentials for given key");
    }
    const keys: SpotifyCredentials = JSON.parse(reply);

    return new SpotifyWebApi({
      accessToken: keys.accessToken,
      refreshToken: keys.refreshToken,
    });
  } catch (e) {
    throw new Error("failed to get value from redis: " + e.message);
  }
}

const getRecentTracks = (
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return async (req: Request, resp: Response) => {
    try {
      const spotify: SpotifyWebApi = await spotifyClientFromRedis(
        req.get("spotify-key"),
        redisClient
      );
      spotify
        .getMyRecentlyPlayedTracks()
        .then((data) => {
          resp.status(200).json(data);
        })
        .catch((e) => {
          resp.status(500).send({ error: e.body.error.message });
        });
    } catch (e) {
      resp.status(500).send({ error: e.message });
    }
  };
};

const getCurrentlyPlaying = (
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return async (req: Request, resp: Response) => {
    try {
      const spotify: SpotifyWebApi = await spotifyClientFromRedis(
        req.get("spotify-key"),
        redisClient
      );
      spotify
        .getMyCurrentPlayingTrack()
        .then((data: SpotifyResponse<SpotifyApi.CurrentlyPlayingResponse>) => {
          resp.status(200).json({
            progress_ms: data.body.progress_ms,
            uri: data.body.item.uri,
            is_playing: data.body.is_playing,
            item_id: data.body.item.id,
          });
          // resp.status(200).json(data);
        })
        .catch((e) => {
          resp.status(500).send({ error: e.body.error.message });
        });
    } catch (e) {
      resp.status(500).send({ error: e.message });
    }
  };
};

const getTrackByID = (
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return async (req: Request, resp: Response) => {
    try {
      const spotify: SpotifyWebApi = await spotifyClientFromRedis(
        req.get("spotify-key"),
        redisClient
      );
      const trackID: string = req.params.id;

      spotify
        .getTrack(trackID)
        .then((data) => {
          resp.status(200).json(data);
        })
        .catch((e) => {
          resp.status(500).send({ error: e.body.error.message });
        });
    } catch (e) {
      resp.status(500).send({ error: e.message });
    }
  };
};

const changePlayerState = (
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return async (req: Request, resp: Response) => {
    try {
      const spotify: SpotifyWebApi = await spotifyClientFromRedis(
        req.get("spotify-key"),
        redisClient
      );

      const position_ms = req.body.position_ms;
      const uris = req.body.uris;

      spotify
        .play({
          position_ms: position_ms,
          uris: uris,
        })
        .then(() => {
          resp.status(204).send();
        })
        .catch((e) => {
          resp.status(500).send({ error: e.body.error.message });
        });
    } catch (e) {
      resp.status(500).send({ error: e.message });
    }
  };
};

const getUserData = (
  redisClient: RedisClient
): ((req: Request, resp: Response) => void) => {
  return async (req: Request, resp: Response) => {
    try {
      const spotify: SpotifyWebApi = await spotifyClientFromRedis(
        req.get("spotify-key"),
        redisClient
      );

      spotify
        .getMe()
        .then((data) => {
          resp.status(200).send({
            display_name: data.body.display_name,
            img_url: data.body.images[0].url,
          });
        })
        .catch((e) => {
          resp.status(500).send({ error: e.body.error.message });
        });
    } catch (e) {
      resp.status(500).send({ error: e.message });
    }
  };
};

export {
  getRecentTracks,
  getCurrentlyPlaying,
  getTrackByID,
  changePlayerState,
  getUserData,
};
