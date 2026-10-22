+++
title = "Settings"
description = "Read settings from the configuration and keep them in storage."
weight = 4
+++

Settings let users configure a plugin. Make the greeting a setting in
`config.yaml`:

```yaml,name=config.yaml
plugins:
  greeter:
    plugin: local/greeter:0.1.0
    settings:
      greeting: Good morning!
```

## Parsing

wpbs passes the settings to `initialization` as JSON. Add serde to the
workspace's `Cargo.toml`:

```toml,name=Cargo.toml
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
wit-bindgen = "0.63"
```

and to `greeter/Cargo.toml`:

```toml,name=greeter/Cargo.toml
[dependencies]
serde.workspace = true
serde_json.workspace = true
wit-bindgen.workspace = true
```

Describe the settings in a new module, `greeter/src/settings.rs`:

```rust,name=greeter/src/settings.rs
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Settings {
    pub greeting: String,
}
```

Declare it at the top of `lib.rs`, and import `Settings`:

```rust,name=greeter/src/lib.rs
mod settings;
```

```rust,name=greeter/src/lib.rs
use settings::Settings;
```

Then parse the argument of `initialization`, now named `settings`:

```rust,name=greeter/src/lib.rs
    async fn initialization(settings: Vec<u8>) -> Result<(), String> {
        let settings: Settings =
            serde_json::from_slice(&settings).map_err(|err| format!("invalid settings: {err}"))?;
```

Invalid settings now stop the plugin when wpbs starts.

## Storage

Each call runs in a fresh
[instance](@/docs/development/plugins/concepts/instances.md), so the settings
are gone once `initialization` returns. Later calls need them, so the plugin
keeps them in storage, the WASI key-value API from the core bindings. In
`settings.rs`:

```rust,name=greeter/src/settings.rs
use crate::bindings::core::wasi::keyvalue::store;
```

```rust,name=greeter/src/settings.rs
impl Settings {
    pub fn save(&self) -> Result<(), String> {
        let bytes = serde_json::to_vec(self).map_err(|err| err.to_string())?;

        store::open("")
            .and_then(|bucket| bucket.set("settings", &bytes))
            .map_err(|err| err.to_string())
    }
}
```

`store::open` opens a bucket, a set of keys. `""` works well as a default
bucket; separate buckets become useful once a plugin stores many different kinds
of data. Storage calls are synchronous.

Save the settings in `initialization`, after parsing them:

```rust,name=greeter/src/lib.rs
        settings.save()?;
```
