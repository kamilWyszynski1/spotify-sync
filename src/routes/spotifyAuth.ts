import express, { Router } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import { spotifyAuth } from '../controllers/spotifyAuth';

const router = express.Router();

export default (spotify: SpotifyWebApi): Router => {
    router.get('/', spotifyAuth(spotify));

    return router
}