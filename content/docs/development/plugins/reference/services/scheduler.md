+++
title = "Scheduler"
description = "Scheduled jobs."
weight = 1
+++

Package `wpbs-services:scheduler`.

## World `scheduler`

Provides job scheduling through cron expressions and callbacks.

```wit
world scheduler {
    import resources;

    export export-functions;
}
```

## Interface `export-functions`

Provides callbacks that execute scheduled jobs.

### Function `job`

Executes the job identified by the provided key.

Called when the job's schedule triggers.

```wit
interface export-functions {
    job: async func(key: string) -> result<_, plugin-error>;
}
```

## Interface `resources`

Provides handles for registering, updating, and deregistering scheduled
jobs.

### Resource `job`

A handle to a job identified by a key.

Handles with the same key refer to the same job.

Constructing a handle does not register the job to a schedule. Dropping
a handle does not deregister the job from its schedule.

Scheduled executions invoke the exported `job` callback with this key.

#### Constructor

Creates a handle to the job identified by the provided key.

```wit
interface resources {
    resource job {
        constructor(key: string);
    }
}
```

#### Method `register`

Registers a job to a schedule.

Schedules use [cron expressions](https://docs.rs/cron/0.17.0/cron/)
in the system's local time zone. Full expressions require a leading
seconds field and allow an optional trailing year field. Shorthands
such as `@daily` are also supported.

A failed registration leaves any existing schedule unchanged.

Returns an error if:
- The scheduler service is disabled.
- The provided cron expression is invalid.
- The job is already registered to a schedule.

```wit
interface resources {
    resource job {
        register: async func(expression: string) -> result<_, host-error>;
    }
}
```

#### Method `update`

Updates a job to a new schedule.

See the `register` method for more information on the cron
expression.

A job preserves its old schedule if this method fails.

Returns an error if:
- The scheduler service is disabled.
- The provided cron expression is invalid.
- The job is not registered to a schedule.

```wit
interface resources {
    resource job {
        update: async func(expression: string) -> result<_, host-error>;
    }
}
```

#### Method `deregister`

Deregisters a job from a schedule.

Returns an error if:
- The scheduler service is disabled.
- The job is not registered to a schedule.

```wit
interface resources {
    resource job {
        deregister: async func() -> result<_, host-error>;
    }
}
```
