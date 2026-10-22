+++
title = "Scheduler"
description = "Crons on cron expressions and one-shots at a point in time."
weight = 1
sort_by = "weight"

[extra]
children_heading = "Interfaces"
+++

Package `wpbs-services:scheduler`.

## World `cron`

Provides crons scheduled through cron expressions.

```wit
world cron {
    import crons;
    export cron-handler;
}
```

## World `one-shot`

Provides one-shots that run once at a point in time.

```wit
world one-shot {
    import one-shots;
    export one-shot-handler;
}
```
