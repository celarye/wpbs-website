+++
title = "Scheduler"
description = "Log the greeting every morning."
weight = 1
+++

The scheduler runs jobs on cron schedules. Enable it in `config.yaml`:

```yaml,name=config.yaml
services:
  scheduler:
    enabled: true
```

## Bindings

Generate the scheduler package's bindings next to core's, in `mod bindings`:

```rust,name=greeter/src/lib.rs
    pub mod scheduler {
        use crate::Plugin;

        wit_bindgen::generate!({
            path: "../wit/services/scheduler",
            with: {
                "wpbs:shared/shared-types@0.1.0": crate::bindings::core::wpbs::shared::shared_types,
            },
        });

        export!(Plugin);
    }
```

The scheduler uses the same shared types as core. `with` reuses the ones core's
bindings generated, so that types such as `HostError` are the same in both
modules.

## Registering the Job

The scheduler code goes in a new module, `greeter/src/scheduler.rs`. Declare it
in `lib.rs`:

```rust,name=greeter/src/lib.rs
mod scheduler;
```

and start it with these imports:

```rust,name=greeter/src/scheduler.rs
use crate::{
    Plugin,
    bindings::{
        core::wpbs::core::{import_functions::log, types::LogLevel},
        scheduler::{
            exports::wpbs_services::scheduler::export_functions::Guest,
            wpbs_services::scheduler::resources::Job,
        },
    },
    settings::Settings,
};
```

A `Job` is a handle to a job, named by a key. Registering it with a
[cron expression](https://docs.rs/cron/0.17.0/cron/) schedules it. Expressions
start with a seconds field; this one runs daily at 09:00, in the system's time
zone:

```rust,name=greeter/src/scheduler.rs
const EVERY_MORNING: &str = "0 0 9 * * *";

pub async fn register() -> Result<(), String> {
    Job::new("morning")
        .register(EVERY_MORNING.to_string())
        .await
        .map_err(|err| err.to_string())
}
```

The job is a
[registration](@/docs/development/plugins/concepts/registrations.md): it lasts
until wpbs stops, so the plugin registers it again on every start.

Call `register` in `initialization`, after saving the settings:

```rust,name=greeter/src/lib.rs
        scheduler::register().await?;
```

## Running the Job

When the schedule triggers, wpbs calls the scheduler's `job` callback with the
job's key. It runs in a fresh instance, so it loads the settings from storage:

```rust,name=greeter/src/scheduler.rs
impl Guest for Plugin {
    async fn job(key: String) -> Result<(), String> {
        if key == "morning" {
            log(LogLevel::Info, Settings::load()?.greeting).await;
        }

        Ok(())
    }
}
```

`Settings::load` does not exist yet. Add it to `impl Settings` in `settings.rs`:

```rust,name=greeter/src/settings.rs
    pub fn load() -> Result<Self, String> {
        let bytes = store::open("")
            .and_then(|bucket| bucket.get("settings"))
            .map_err(|err| err.to_string())?
            .ok_or("no settings stored")?;

        serde_json::from_slice(&bytes).map_err(|err| err.to_string())
    }
```
