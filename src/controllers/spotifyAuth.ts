import { Logger } from 'winston'
import createLogger from '../utils/logger'
import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';


const logger: Logger = createLogger('controller:spotifyAuth')

const spotifyAuth = (spotify: SpotifyWebApi): (req: Request, resp: Response) => void => {

    return (req: Request, resp: Response) => {

        const code: string = (req.query as any).code;


        // Retrieve an access token and a refresh token
        spotify.authorizationCodeGrant(code).then(
            function (data) {
                console.log('The token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
                console.log('The refresh token is ' + data.body['refresh_token']);

                // Set the access token on the API object to use it in later calls
                spotify.setAccessToken(data.body['access_token']);
                spotify.setRefreshToken(data.body['refresh_token']);
            },
            function (err) {
                console.log('Something went wrong!', err);
            }
        );
        resp.status(200).send()
    }

}

export { spotifyAuth }