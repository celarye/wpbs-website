+++
title = "Interactions"
description = "The registrations and interaction-handler interfaces."
weight = 2
+++

## Interface `registrations`

Provides handles for application commands, message components, and modals.

Every operation that returns a `host-error` fails with `unavailable` if
the Discord service is disabled or unreachable.

### Resource `application-command`

A handle to an application command identified by a key.

Handles with the same key refer to the same command. The key is
independent of the command's Discord name and ID.

Constructing a handle does not register the command. Dropping a handle
does not deregister the command.

A registered command stays registered when wpbs stops. If it is not
registered again during the next successful initialization, wpbs
deregisters it.

Interactions with the command invoke the exported `interaction` callback
with this key.

#### Constructor

Creates a handle to the command identified by the provided key.

```wit
interface registrations {
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
- The command data is invalid (`invalid-argument`).
- The command data is rejected by Discord (`other`).

```wit
interface registrations {
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
- The command data is invalid (`invalid-argument`).
- The command data is rejected by Discord (`other`).
- The command is not registered (`not-found`).

```wit
interface registrations {
    resource application-command {
        update: async func(data: json) -> result<_, host-error>;
    }
}
```

#### Method `name`

Returns the command's Discord name.

See the `register` method for when it differs from the requested
name.

Returns an error if the command is not registered (`not-found`).

```wit
interface registrations {
    resource application-command {
        name: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a command from Discord.

Returns an error if the command is not registered (`not-found`).

```wit
interface registrations {
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
successful initialization, wpbs deregisters it.

#### Constructor

Creates a handle to the component identified by the provided key.

```wit
interface registrations {
    resource message-component {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a component and generates its custom ID.

Registering a registered component has no effect and keeps its
custom ID.

```wit
interface registrations {
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

Returns an error if the component is not registered (`not-found`).

```wit
interface registrations {
    resource message-component {
        update: async func() -> result<_, host-error>;
    }
}
```

#### Method `custom-id`

Returns the component's custom ID.

Returns an error if the component is not registered (`not-found`).

```wit
interface registrations {
    resource message-component {
        custom-id: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a component.

Interactions using its custom ID no longer invoke the `interaction`
callback.

Returns an error if the component is not registered (`not-found`).

```wit
interface registrations {
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
callback. If it is not registered again during the next successful
initialization, wpbs deregisters it.

#### Constructor

Creates a handle to the modal identified by the provided key.

```wit
interface registrations {
    resource modal {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a modal and generates its custom ID.

Registering a registered modal has no effect and keeps its custom
ID.

```wit
interface registrations {
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

Returns an error if the modal is not registered (`not-found`).

```wit
interface registrations {
    resource modal {
        update: async func() -> result<_, host-error>;
    }
}
```

#### Method `custom-id`

Returns the modal's custom ID.

Returns an error if the modal is not registered (`not-found`).

```wit
interface registrations {
    resource modal {
        custom-id: async func() -> result<string, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a modal.

Submissions using its custom ID no longer invoke the `interaction`
callback.

Returns an error if the modal is not registered (`not-found`).

```wit
interface registrations {
    resource modal {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Enum `interaction-kind`

A kind of Discord interaction.

```wit
interface registrations {
    enum interaction-kind {
        application-command,
        message-component,
        modal,
    }
}
```

## Interface `interaction-handler`

Provides the callback that handles Discord interactions.

### Function `interaction`

Handles a Discord interaction with a registered application command,
message component, or modal.

The kind and key identify the resource the interaction belongs to. The
payload is the interaction's Discord JSON data.

```wit
interface interaction-handler {
    interaction: async func(
        kind: interaction-kind,
        key: string,
        payload: json,
    ) -> result<_, plugin-error>;
}
```
