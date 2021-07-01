import { Logger } from "winston";
import createLogger from "../utils/logger";
import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
/// <reference types="spotify-api" />

interface SpotifyResponse<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

const logger: Logger = createLogger("controller:spotify");

const getRecentTracks = (
  spotify: SpotifyWebApi
): ((req: Request, resp: Response) => void) => {
  return (req: Request, resp: Response) => {
    if (spotify.getAccessToken() == undefined) {
      logger.error("spotify client not initialized");
      resp.status(500).send({ error: "spotify client not initialized" });
      return;
    }

    spotify
      .getMyRecentlyPlayedTracks()
      .then((data) => {
        resp.status(200).json(data);
      })
      .catch((e) => {
        resp.status(500).send({ error: e.body.error.message });
      });
  };
};

const getCurrentlyPlaying = (
  spotify: SpotifyWebApi
): ((req: Request, resp: Response) => void) => {
  return (req: Request, resp: Response) => {
    if (spotify.getAccessToken() == undefined) {
      logger.error("spotify client not initialized");
      resp.status(500).send({ error: "spotify client not initialized" });
      return;
    }

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
  };
};

const getTrackByID = (
  spotify: SpotifyWebApi
): ((req: Request, resp: Response) => void) => {
  return (req: Request, resp: Response) => {
    if (spotify.getAccessToken() == undefined) {
      logger.error("spotify client not initialized");
      resp.status(500).send({ error: "spotify client not initialized" });
      return;
    }

    const trackID: string = req.params.id;

    spotify
      .getTrack(trackID)
      .then((data) => {
        resp.status(200).json(data);
      })
      .catch((e) => {
        resp.status(500).send({ error: e.body.error.message });
      });
  };
};

const changePlayerState = (
  spotify: SpotifyWebApi
): ((req: Request, resp: Response) => void) => {
  return (req: Request, resp: Response) => {
    if (spotify.getAccessToken() == undefined) {
      logger.error("spotify client not initialized");
      resp.status(500).send({ error: "spotify client not initialized" });
      return;
    }

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
  };
};

export {
  getRecentTracks,
  getCurrentlyPlaying,
  getTrackByID,
  changePlayerState,
};
