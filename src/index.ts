import express from 'express'
import { Logger } from 'winston';
import { router as testRouter } from './routes/test';
import spotifyAuthRouter from './routes/spotifyAuth'
import createLogger from './utils/logger'
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';


const log: Logger = createLogger('index');
dotenv.config()
const app = express()
const port = 5000

app.use(express.json())

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/callback'
});

app.use('/test', testRouter)
app.use('/callback', spotifyAuthRouter(spotifyApi))

var scopes = ['user-read-private', 'user-read-email'],
    state = 'state'

log.info(spotifyApi.createAuthorizeURL(scopes, state))

log.info('starting server')

app.listen(port, () => log.info(`Running on port ${port}`))
