+++
title = "Core"
description = "Persistent storage, logging, and host and plugin lifecycle operations."
weight = 1
sort_by = "weight"

[extra]
children_heading = "Interfaces"
+++

Package `wpbs:core`.

## World `core`

Provides persistent storage, logging, and host and plugin lifecycle
operations.

```wit
world core {
    include wasi:keyvalue/imports@0.2.0-draft2;

    import logging;

    import lifecycle;
    export lifecycle-handler;
}
```
