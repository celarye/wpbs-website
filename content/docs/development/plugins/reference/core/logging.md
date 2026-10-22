+++
title = "Logging"
description = "The logging interface."
weight = 2
+++

## Interface `logging`

Provides logging.

### Function `log`

Logs a message at the provided level.

```wit
interface logging {
    log: func(level: log-level, message: string);
}
```

### Enum `log-level`

A severity level for a log message.

```wit
interface logging {
    enum log-level {
        trace,
        debug,
        info,
        warn,
        error,
    }
}
```
