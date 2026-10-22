+++
title = "One Shot"
description = "The one-shots and one-shot-handler interfaces."
weight = 2
+++

## Interface `one-shots`

Provides handles for one-shots that run once at a point in time.

Every operation that returns a `host-error` fails with `unavailable` if
the scheduler service is disabled.

### Resource `one-shot`

A handle to a one-shot identified by a key.

Handles with the same key refer to the same one-shot.

Constructing a handle does not register the one-shot to a time. Dropping
a handle does not deregister the one-shot from its time. A registered
one-shot lasts until it is executed or wpbs stops.

The scheduled execution invokes the exported `one-shot` callback with
this key. The one-shot is deregistered once it has been executed.

#### Constructor

Creates a handle to the one-shot identified by the provided key.

```wit
interface one-shots {
    resource one-shot {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a one-shot to a time.

A time in the past executes the one-shot as soon as possible.

A failed registration leaves any existing time unchanged.

Returns an error if the one-shot is already registered to a time
(`already-exists`).

```wit
interface one-shots {
    resource one-shot {
        register: async func(time: timestamp) -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates a one-shot to a new time.

See the `register` method for more information on the time.

A one-shot preserves its old time if this method fails.

Returns an error if the one-shot is not registered to a time
(`not-found`).

```wit
interface one-shots {
    resource one-shot {
        update: async func(time: timestamp) -> result<_, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a one-shot from its time.

Returns an error if the one-shot is not registered to a time
(`not-found`).

```wit
interface one-shots {
    resource one-shot {
        deregister: async func() -> result<_, host-error>;
    }
}
```

### Type `timestamp`

A point in time in seconds since the Unix epoch.

```wit
interface one-shots {
    type timestamp = u64;
}
```

## Interface `one-shot-handler`

Provides the callback that executes one-shots.

### Function `one-shot`

Executes the one-shot identified by the provided key.

Called when the one-shot's time is reached.

```wit
interface one-shot-handler {
    one-shot: async func(key: string) -> result<_, plugin-error>;
}
```
