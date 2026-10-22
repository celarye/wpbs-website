+++
title = "Discord"
description = "Connect the plugin to Discord."
weight = 2
sort_by = "weight"

[extra]
ordered = true
+++

The Discord service connects wpbs to Discord. Set up an application and enable
the service as described in
[Services](@/docs/usage/configuration/services.md#discord), with these intents:

```yaml,name=config.yaml
services:
  discord:
    enabled: true
    settings:
      intents:
        - Guilds
        - GuildMessages
        - MessageContent
```

## Bindings

Generate the Discord package's bindings in `mod bindings`, like the scheduler's:

```rust,name=greeter/src/lib.rs
    pub mod discord {
        use crate::Plugin;

        wit_bindgen::generate!({
            path: "../wit/services/discord",
            with: {
                "wpbs:shared/shared-types@0.1.0": crate::bindings::core::wpbs::shared::shared_types,
            },
        });

        export!(Plugin);
    }
```

The Discord code goes in `greeter/src/discord.rs`. Declare it in `lib.rs`:

```rust,name=greeter/src/lib.rs
mod discord;
```

The package has two callbacks: `event` for Discord events, and `interaction` for
interactions with the plugin's commands, buttons, and modals. Start with empty
ones, and a `register` function for the registrations to come:

```rust,name=greeter/src/discord.rs
use crate::{
    Plugin,
    bindings::discord::{
        exports::wpbs_services::discord::export_functions::Guest,
        wpbs_services::discord::types::{EventKind, InteractionKind},
    },
};

pub async fn register() -> Result<(), String> {
    Ok(())
}

impl Guest for Plugin {
    async fn event(_kind: EventKind, _payload: Vec<u8>) -> Result<(), String> {
        Ok(())
    }

    async fn interaction(
        _kind: InteractionKind,
        _key: String,
        _payload: Vec<u8>,
    ) -> Result<(), String> {
        Ok(())
    }
}
```

Call it in `initialization`:

```rust,name=greeter/src/lib.rs
        discord::register().await?;
```

## Features

The pages below add greeter's Discord features:
