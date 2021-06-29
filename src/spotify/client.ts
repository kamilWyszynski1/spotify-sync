import axios from 'axios';

interface SpotifyI {
    StartResumeUserPlayback(p: Playback): void
}

class SpotifyClient implements SpotifyI {

    StartResumeUserPlayback(p: Playback): void {
        throw new Error("Method not implemented.");
    }

}

