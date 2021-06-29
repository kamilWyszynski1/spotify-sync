interface Playback {
    // The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.
    DeviceID?: string,
    ContextURI?: string,
    URIs?: Array<string>,
    PositionMs?: number
}