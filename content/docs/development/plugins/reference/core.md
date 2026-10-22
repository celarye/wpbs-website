+++
title = "Core"
description = "Lifecycle callbacks, logging, and shutdown requests."
weight = 1
+++

Package `wpbs:core`.

## World `core`

Provides logging, persistent storage, and plugin and host lifecycle
operations.

```wit
world core {
    include wasi:keyvalue/imports@0.2.0-draft2;

    import import-functions;
    export export-functions;
}
```

## Interface `import-functions`

Provides logging and host shutdown requests.

### Function `log`

Logs a message at the provided level.

```wit
interface import-functions {
    log: async func(level: log-level, message: string);
}
```

### Function `shutdown`

Requests graceful host shutdown or restart.

Success means the request is accepted.

Returns an error if the plugin does not have shutdown permission.

```wit
interface import-functions {
    shutdown: async func(action: shutdown-action) -> result<_, host-error>;
}
```

## Interface `export-functions`

Provides plugin initialization and cleanup callbacks.

### Function `initialization`

Initializes the plugin with the provided settings.

Called once during startup.

Memory does not persist between callbacks. Store settings and other
state needed later in the key-value store.

```wit
interface export-functions {
    initialization: async func(settings: json) -> result<_, plugin-error>;
}
```

### Function `shutdown`

Performs final cleanup for the plugin.

Called during graceful shutdown.

```wit
interface export-functions {
    shutdown: async func() -> result<_, plugin-error>;
}
```

## Interface `types`

Provides logging levels and host shutdown actions.

### Enum `log-level`

A severity level for a log message.

```wit
interface types {
    enum log-level {
        trace,
        debug,
        info,
        warn,
        error,
    }
}
```

### Enum `shutdown-action`

A host shutdown action.

```wit
interface types {
    enum shutdown-action {
        stop,
        restart,
    }
}
```
