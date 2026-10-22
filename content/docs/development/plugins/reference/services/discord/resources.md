+++
title = "Resources"
description = "Registrations and voice channels."
weight = 1
+++

## Interface `resources`

Provides handles for event subscriptions, application commands, message
components, modals, and voice channels.

### Resource `event-subscription`

A handle to the plugin's event subscription.

All handles refer to the same subscription.

Constructing a handle does not register the subscription. Dropping a
handle does not deregister the subscription.

Events of subscribed kinds invoke the exported `event` callback.

#### Constructor

Creates a handle to the event subscription.

```wit
interface resources {
    resource event-subscription {
        constructor();
    }
}
```

#### Method `register`

Registers the subscription to the provided event kinds.

Only events allowed by the enabled gateway intents are received.
Subscribing to `interaction-create` has no effect. Interactions are
received through the exported `interaction` callback instead.

A failed registration leaves any existing subscription unchanged.

Returns an error if:
- The Discord service is disabled.
- The subscription is already registered.

```wit
interface resources {
    resource event-subscription {
        register: async func(kinds: list<event-kind>) -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates the subscription to new event kinds.

See the `register` method for more information on the event kinds.

A subscription preserves its old event kinds if this method fails.

Returns an error if:
- The Discord service is disabled.
- The subscription is not registered.

```wit
interface resources {
    resource event-subscription {
        update: async func(kinds: list<event-kind>) -> result<_, host-error>;
    }
}
```

#### Method `deregister`

Deregisters the subscription.

Returns an error if:
- The Discord service is disabled.
- The subscription is not registered.

```wit
interface resources {
    resource event-subscription {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Resource `application-command`

A handle to an application command identified by a key.

Handles with the same key refer to the same command. The key is
independent of the command's Discord name and ID.

Constructing a handle does not register the command. Dropping a handle
does not deregister the command.

A registered command stays registered when wpbs stops. If it is not
registered again during the next initialization, wpbs deregisters it.

Interactions with the command invoke the exported `interaction` callback
with this key.

#### Constructor

Creates a handle to the command identified by the provided key.

```wit
interface resources {
    resource application-command {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a command with Discord.

The command is global, or limited to the guild identified by the
provided ID. The data is a Discord application command object.

If other commands use the same name, all of them get a numeric
suffix. The `name` method returns the resulting name.

Registering a registered command updates it to the provided guild
and data. It has no effect if neither changed.

A failed registration leaves any existing command unchanged.

Returns an error if:
- The Discord service is disabled.
- The command data is invalid or rejected by Discord.

```wit
interface resources {
    resource application-command {
        register: async func(
            guild-id: option<snowflake>,
            data: json,
        ) -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates a command to new data.

See the `register` method for more information on the command data.
The command keeps its guild and type; registering it again can
change either.

A command preserves its old data if this method fails.

Returns an error if:
- The Discord service is disabled.
- The command data is invalid or rejected by Discord.
- The command is not registered.

```wit
interface resources {
    resource application-command {
        update: async func(data: json) -> result<_, host-error>;
    }
}
```

#### Method `name`

Returns the command's Discord name.

See the `register` method for when it differs from the requested
name.

Returns an error if:
- The Discord service is disabled.
- The command is not registered.

```wit
interface resources {
    resource application-command {
        name: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a command from Discord.

Returns an error if:
- The Discord service is disabled.
- The command is not registered.

```wit
interface resources {
    resource application-command {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Resource `message-component`

A handle to a message component identified by a key.

Handles with the same key refer to the same component. Message component
keys are separate from modal keys.

Constructing a handle does not register the component. Dropping a handle
does not deregister the component.

Interactions with components using the component's custom ID invoke the
exported `interaction` callback with this key.

A registered component stays registered when wpbs stops, so interactions
with messages sent before a restart still invoke the exported
`interaction` callback. If it is not registered again during the next
initialization, wpbs deregisters it.

#### Constructor

Creates a handle to the component identified by the provided key.

```wit
interface resources {
    resource message-component {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a component and generates its custom ID.

Registering a registered component has no effect and keeps its
custom ID.

Returns an error if the Discord service is disabled.

```wit
interface resources {
    resource message-component {
        register: async func() -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates a component to a new custom ID.

Interactions using the old custom ID no longer invoke the
`interaction` callback. Sent messages keep the old custom ID until
edited.

A component preserves its old custom ID if this method fails.

Returns an error if:
- The Discord service is disabled.
- The component is not registered.

```wit
interface resources {
    resource message-component {
        update: async func() -> result<_, host-error>;
    }
}
```

#### Method `custom-id`

Returns the component's custom ID.

Returns an error if:
- The Discord service is disabled.
- The component is not registered.

```wit
interface resources {
    resource message-component {
        custom-id: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a component.

Interactions using its custom ID no longer invoke the `interaction`
callback.

Returns an error if:
- The Discord service is disabled.
- The component is not registered.

```wit
interface resources {
    resource message-component {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Resource `modal`

A handle to a modal identified by a key.

Handles with the same key refer to the same modal. Modal keys are
separate from message component keys.

Constructing a handle does not register the modal. Dropping a handle
does not deregister the modal.

Submissions of modals using the modal's custom ID invoke the exported
`interaction` callback with this key.

A registered modal stays registered when wpbs stops, so submissions of
modals shown before a restart still invoke the exported `interaction`
callback. If it is not registered again during the next initialization,
wpbs deregisters it.

#### Constructor

Creates a handle to the modal identified by the provided key.

```wit
interface resources {
    resource modal {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a modal and generates its custom ID.

Registering a registered modal has no effect and keeps its custom
ID.

Returns an error if the Discord service is disabled.

```wit
interface resources {
    resource modal {
        register: async func() -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates a modal to a new custom ID.

Submissions using the old custom ID no longer invoke the
`interaction` callback.

A modal preserves its old custom ID if this method fails.

Returns an error if:
- The Discord service is disabled.
- The modal is not registered.

```wit
interface resources {
    resource modal {
        update: async func() -> result<_, host-error>;
    }
}
```

#### Method `custom-id`

Returns the modal's custom ID.

Returns an error if:
- The Discord service is disabled.
- The modal is not registered.

```wit
interface resources {
    resource modal {
        custom-id: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a modal.

Submissions using its custom ID no longer invoke the `interaction`
callback.

Returns an error if:
- The Discord service is disabled.
- The modal is not registered.

```wit
interface resources {
    resource modal {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Resource `voice-channel`

A handle to the bot's voice channel in a guild.

Handles with the same guild ID refer to the same voice channel.

Constructing a handle does not join a voice channel. Dropping a handle
does not leave the voice channel or stop its tracks.

#### Constructor

Creates a handle to the voice channel in the guild identified by the
provided ID.

```wit
interface resources {
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
- The Discord service is disabled.
- The connection would move while the queue contains tracks not
  queued by the caller.
- The voice channel cannot be joined.

```wit
interface resources {
    resource voice-channel {
        join: async func(channel-id: snowflake) -> result<_, host-error>;
    }
}
```

#### Method `leave`

Leaves the voice channel.

Leaving stops all tracks and closes all receive streams.

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.
- The queue contains tracks not queued by the caller.

```wit
interface resources {
    resource voice-channel {
        leave: async func() -> result<_, host-error>;
    }
}
```

#### Method `get-info`

Returns information about the voice channel connection.

Returns an error if the Discord service is disabled.

```wit
interface resources {
    resource voice-channel {
        get-info: async func() -> result<voice-channel-info, host-error>;
    }
}
```

#### Method `mute`

Mutes or unmutes the connection.

A muted connection sends no audio while its tracks keep playing.

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.
- The queue contains tracks not queued by the caller.

```wit
interface resources {
    resource voice-channel {
        mute: async func(mute: bool) -> result<_, host-error>;
    }
}
```

#### Method `deafen`

Deafens or undeafens the connection.

A deafened connection cannot be listened to.

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.
- The queue contains tracks not queued by the caller.
- A receive stream not opened by the caller is open.

```wit
interface resources {
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

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.

```wit
interface resources {
    resource voice-channel {
        enqueue: async func(audio: stream<u8>) -> result<track, host-error>;
    }
}
```

#### Method `stop`

Stops all tracks queued by the caller.

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.

```wit
interface resources {
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

Returns an error if:
- The Discord service is disabled.
- No voice channel is joined.
- The connection is deafened.

```wit
interface resources {
    resource voice-channel {
        listen: async func() -> result<stream<u8>, host-error>;
    }
}
```
