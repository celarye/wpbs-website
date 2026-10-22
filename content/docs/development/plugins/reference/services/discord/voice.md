+++
title = "Voice"
description = "The voice-channels interface."
weight = 5
+++

## Interface `voice-channels`

Provides handles for voice channels and their tracks.

Every operation that returns a `host-error` fails with `unavailable` if
the Discord service is disabled or unreachable.

### Resource `voice-channel`

A handle to the bot's voice channel in a guild.

Handles with the same guild ID refer to the same voice channel.

Constructing a handle does not join a voice channel. Dropping a handle
does not leave the voice channel or stop its tracks.

#### Constructor

Creates a handle to the voice channel in the guild identified by the
provided ID.

```wit
interface voice-channels {
    resource voice-channel {
        constructor(guild-id: snowflake);
    }
}
```

#### Method `join`

Joins the voice channel identified by the provided ID.

Joining another channel moves the connection. Joining the current
channel has no effect.

Returns an error if:
- The connection would move while the queue contains tracks not
  queued by the caller (`permission-denied`).
- The connection would move while a receive stream not opened by
  the caller is open (`permission-denied`).
- The voice channel cannot be joined (`other`).

```wit
interface voice-channels {
    resource voice-channel {
        join: async func(channel-id: snowflake) -> result<_, host-error>;
    }
}
```

#### Method `leave`

Leaves the voice channel.

Leaving stops all tracks and closes all receive streams.

Returns an error if:
- No voice channel is joined (`not-found`).
- The queue contains tracks not queued by the caller
  (`permission-denied`).
- A receive stream not opened by the caller is open
  (`permission-denied`).

```wit
interface voice-channels {
    resource voice-channel {
        leave: async func() -> result<_, host-error>;
    }
}
```

#### Method `get-info`

Returns information about the voice channel connection.

```wit
interface voice-channels {
    resource voice-channel {
        get-info: async func() -> result<voice-channel-info, host-error>;
    }
}
```

#### Method `mute`

Mutes or unmutes the connection.

A muted connection sends no audio while its tracks keep playing.

Returns an error if:
- No voice channel is joined (`not-found`).
- The queue contains tracks not queued by the caller
  (`permission-denied`).

```wit
interface voice-channels {
    resource voice-channel {
        mute: async func(mute: bool) -> result<_, host-error>;
    }
}
```

#### Method `deafen`

Deafens or undeafens the connection.

A deafened connection receives no audio.

Returns an error if:
- No voice channel is joined (`not-found`).
- Deafening while the queue contains tracks not queued by the
  caller (`permission-denied`).
- Deafening while a receive stream is open (`permission-denied`).

```wit
interface voice-channels {
    resource voice-channel {
        deafen: async func(deaf: bool) -> result<_, host-error>;
    }
}
```

#### Method `enqueue`

Queues audio for playback and returns its track.

The audio is raw PCM: signed 16-bit little-endian samples at 48 kHz,
with interleaved stereo channels. The track plays the audio as the
stream provides it and ends when the stream ends.

Tracks queued by the caller play in the order they are queued.

Returns an error if no voice channel is joined (`not-found`).

```wit
interface voice-channels {
    resource voice-channel {
        enqueue: async func(audio: stream<u8>) -> result<track, host-error>;
    }
}
```

#### Method `stop`

Stops all tracks queued by the caller.

Returns an error if no voice channel is joined (`not-found`).

```wit
interface voice-channels {
    resource voice-channel {
        stop: async func() -> result<_, host-error>;
    }
}
```

#### Method `listen`

Returns a stream of the audio received in the voice channel.

The audio of all speakers is mixed into the format described by the
`enqueue` method, with silence while nobody speaks. The stream ends
when the voice channel is left or the connection is lost.

Listening undeafens the connection.

Returns an error if no voice channel is joined (`not-found`).

```wit
interface voice-channels {
    resource voice-channel {
        listen: async func() -> result<stream<u8>, host-error>;
    }
}
```

### Record `voice-channel-info`

Information about a voice channel connection.

The channel ID is absent when no voice channel is joined. The tracks are
listed in playback order.

```wit
interface voice-channels {
    record voice-channel-info {
        channel-id: option<snowflake>,
        connected: bool,
        mute: bool,
        deaf: bool,
        tracks: list<track>,
    }
}
```

### Resource `track`

A handle to a queued track.

Dropping a handle does not stop the track.

#### Method `play`

Resumes a paused track.

Returns an error if:
- The track has ended (`not-found`).
- The track is waiting in the queue (`permission-denied`).
- The track was not queued by the caller (`permission-denied`).

```wit
interface voice-channels {
    resource track {
        play: async func() -> result<_, host-error>;
    }
}
```

#### Method `pause`

Pauses a track.

Returns an error if:
- The track has ended (`not-found`).
- The track was not queued by the caller (`permission-denied`).

```wit
interface voice-channels {
    resource track {
        pause: async func() -> result<_, host-error>;
    }
}
```

#### Method `stop`

Stops a track.

A stopped track cannot be resumed.

Returns an error if:
- The track has ended (`not-found`).
- The track was not queued by the caller (`permission-denied`).

```wit
interface voice-channels {
    resource track {
        stop: async func() -> result<_, host-error>;
    }
}
```

#### Method `set-volume`

Sets the volume of a track.

A volume of `1.0` plays the audio unchanged.

Returns an error if:
- The track has ended (`not-found`).
- The track was not queued by the caller (`permission-denied`).

```wit
interface voice-channels {
    resource track {
        set-volume: async func(volume: f32) -> result<_, host-error>;
    }
}
```

#### Method `get-info`

Returns information about a track.

Returns an error if the track has ended (`not-found`).

```wit
interface voice-channels {
    resource track {
        get-info: async func() -> result<track-info, host-error>;
    }
}
```

### Record `track-info`

Information about a track.

The UUID tells whether two handles refer to the same track.

```wit
interface voice-channels {
    record track-info {
        uuid: string,
        mode: play-mode,
        volume: f32,
        position: duration,
    }
}
```

### Variant `play-mode`

A playback mode of a track.

A track waiting in the queue is in the `pause` mode.

```wit
interface voice-channels {
    variant play-mode {
        play,
        pause,
        stop,
        end,
        errored(string),
    }
}
```

### Type `duration`

A duration in nanoseconds.

```wit
interface voice-channels {
    type duration = u64;
}
```
