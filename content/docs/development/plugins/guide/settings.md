+++
title = "Settings"
description = "Read settings from the configuration and keep them in storage."
weight = 4
+++

Settings let users configure a plugin. Make the greeting a setting in
`config.yaml`:

```yaml,name=config.yaml,hl_lines=4-5
plugins:
  greeter:
    plugin: local/greeter:0.1.0
    settings:
      greeting: Good morning!
```

## Parsing

wpbs passes the settings to `initialization` as JSON. Add
[`serde`](https://docs.rs/serde) and
[`serde_json`](https://docs.rs/serde_json) to the workspace's `Cargo.toml`,
along with [`anyhow`](https://docs.rs/anyhow) for the errors of the plugin's
own functions:

```toml,name=Cargo.toml,hl_lines=2-4
[workspace.dependencies]
anyhow = "1"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
wit-bindgen = "0.63"
```

and to `greeter/Cargo.toml`:

```toml,name=greeter/Cargo.toml,hl_lines=2-4
[dependencies]
anyhow.workspace = true
serde.workspace = true
serde_json.workspace = true
wit-bindgen.workspace = true
```

The settings are described by a struct that serde (de)serializes. Import serde's
derives in `lib.rs`:

```rust,name=greeter/src/lib.rs,hl_lines=5
use bindings::core::{
    exports::wpbs::core::lifecycle_handler::Guest,
    wpbs::core::logging::{LogLevel, log},
};
use serde::{Deserialize, Serialize};
```

and describe the settings below `Plugin`:

```rust,name=greeter/src/lib.rs,hl_lines=3-6
struct Plugin;

#[derive(Deserialize, Serialize)]
struct Settings {
    greeting: String,
}
```

Then parse the argument of `initialization`, now named `settings`, and log the
greeting from the settings in place of the fixed one:

```rust,name=greeter/src/lib.rs,hl_lines=1-3 5
    async fn initialization(settings: Vec<u8>) -> Result<(), String> {
        let settings: Settings = serde_json::from_slice(&settings)
            .map_err(|err| format!("invalid settings: {err}"))?;

        log(LogLevel::Info, settings.greeting);

        Ok(())
    }
```

Callbacks return their errors as strings, so `map_err` turns serde's error into
one, such as its message for a missing field. Invalid settings now stop the
plugin when wpbs starts.

## Storage

Each call runs in a fresh
[instance](@/docs/development/plugins/concepts/instances.md), so the settings
are gone once `initialization` returns. Later calls need them, so the plugin
keeps them in storage, the WASI key-value API from the core bindings. Import
it:

```rust,name=greeter/src/lib.rs,hl_lines=3
use bindings::core::{
    exports::wpbs::core::lifecycle_handler::Guest,
    wasi::keyvalue::store,
    wpbs::core::logging::{LogLevel, log},
};
```

and add a method to `Settings` that saves them:

```rust,name=greeter/src/lib.rs,hl_lines=6-13
#[derive(Deserialize, Serialize)]
struct Settings {
    greeting: String,
}

impl Settings {
    fn save(&self) -> anyhow::Result<()> {
        let bytes = serde_json::to_vec(self)?;
        store::open("")?.set("settings", &bytes)?;

        Ok(())
    }
}
```

`store::open` opens a bucket, a set of keys. `""` works well as a default
bucket; separate buckets become useful once a plugin stores many different kinds
of data. Storage calls are synchronous.

Save the settings in `initialization`, between parsing them and logging the
greeting. `save` returns an `anyhow::Result`, whose error becomes a string with
`{err:#}`, which prints the error's context followed by its cause:

```rust,name=greeter/src/lib.rs,hl_lines=5
    async fn initialization(settings: Vec<u8>) -> Result<(), String> {
        let settings: Settings = serde_json::from_slice(&settings)
            .map_err(|err| format!("invalid settings: {err}"))?;

        settings.save().map_err(|err| format!("{err:#}"))?;

        log(LogLevel::Info, settings.greeting);

        Ok(())
    }
```

`save` only borrows the settings, so the log can still take the greeting.
