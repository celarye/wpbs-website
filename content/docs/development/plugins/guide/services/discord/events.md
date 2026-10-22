+++
title = "Events"
description = "Reply to messages that say !hello."
weight = 1
+++

Event payloads are Discord's JSON, and requests to Discord carry JSON bodies.
[Twilight](https://twilight.rs) has Rust types for the payloads in
[`twilight-model`](https://docs.rs/twilight-model)
([wpbs fork](https://github.com/wpbs-rs/twilight/tree/main/twilight-model)), and
builds requests with the client in
[`twilight-http`](https://docs.rs/twilight-http)
([wpbs fork](https://github.com/wpbs-rs/twilight/tree/main/twilight-http)). Add
both to the workspace's `Cargo.toml`:

```toml,name=Cargo.toml,hl_lines=5-6
[workspace.dependencies]
anyhow = "1"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
twilight-http = { git = "https://github.com/wpbs-rs/twilight", default-features = false }
twilight-model = { git = "https://github.com/wpbs-rs/twilight" }
wit-bindgen = "0.63"
```

wpbs sends the requests, so the client needs none of its default features, such
as TLS. Add the crates to `greeter/Cargo.toml` as well:

```toml,name=greeter/Cargo.toml,hl_lines=5-6
[dependencies]
anyhow.workspace = true
serde.workspace = true
serde_json.workspace = true
twilight-http.workspace = true
twilight-model.workspace = true
wit-bindgen.workspace = true
```

The client uses parts of Tokio that WebAssembly only supports as unstable
features. Enable them in `.cargo/config.toml`:

```toml,name=.cargo/config.toml,hl_lines=3
[build]
target = "wasm32-wasip3"
rustflags = ["--cfg", "tokio_unstable"]
```

## Bindings

Receiving events needs the `events` world, and replying needs `requests`, which
only has functions to call. Generate both in `mod bindings`:

```rust,name=greeter/src/lib.rs,hl_lines=5-30
            export!(Plugin);
        }
    }

    pub mod discord {
        pub mod events {
            use crate::Plugin;

            wit_bindgen::generate!({
                path: "../wit/services/discord",
                world: "events",
                with: {
                    "wpbs:shared/shared-types@0.1.0": crate::bindings::core::wpbs::shared::shared_types,
                },
            });

            export!(Plugin);
        }

        pub mod requests {
            wit_bindgen::generate!({
                path: "../wit/services/discord",
                world: "requests",
                with: {
                    "wpbs:shared/shared-types@0.1.0": crate::bindings::core::wpbs::shared::shared_types,
                },
            });
        }
    }
}
```

Then add the imports this page needs to the top of `discord.rs`:

```rust,name=greeter/src/discord.rs
use twilight_http::{client::ClientBuilder, request::TryIntoRequest};
use twilight_model::gateway::payload::incoming::MessageCreate;

use crate::{
    Plugin, Settings,
    bindings::discord::{
        events::{
            exports::wpbs_services::discord::event_handler,
            wpbs_services::discord::subscriptions::{EventKind, EventSubscription},
        },
        requests::wpbs_services::discord::client::{Body, RequestData, Route, request},
    },
};
```

## Subscribing

A plugin only receives the event kinds it subscribes to. Like the cron, its
subscription is a registration that lasts until wpbs stops, so it is registered
on every start:

```rust,name=greeter/src/discord.rs
async fn subscribe() -> anyhow::Result<()> {
    EventSubscription::new()
        .register(vec![EventKind::MessageCreate])
        .await?;

    Ok(())
}
```

Call it from `register`:

```rust,name=greeter/src/discord.rs,hl_lines=2
pub async fn register() -> anyhow::Result<()> {
    subscribe().await?;

    Ok(())
}
```

## Replying

New messages go to a handler, `on_message`, which replies to `!hello` with a
[Create Message](https://docs.discord.com/developers/resources/message#create-message)
request. `Route` selects the endpoint and its parameters, and the client builds
the body:

```rust,name=greeter/src/discord.rs
async fn on_message(payload: &[u8]) -> anyhow::Result<()> {
    let message: MessageCreate = serde_json::from_slice(payload)?;

    if message.content != "!hello" {
        return Ok(());
    }

    let greeting = Settings::load()?.greeting;
    let client = ClientBuilder::new().ratelimiter(None).build();
    let create_message = client
        .create_message(message.channel_id)
        .content(&greeting)
        .try_into_request()?;

    request(RequestData {
        route: Route::CreateMessage(message.channel_id.get()),
        body: create_message.body().map(|body| Body::Json(body.to_vec())),
        headers: None,
    })
    .await?;

    Ok(())
}
```

The client only builds requests. wpbs sends them with the bot's token and
applies Discord's rate limits, so the client is built without a token or a rate
limiter.

## Handling Messages

The `events` world's callback, `event`, receives the event's kind and its JSON
payload. Implement it to pass new messages on to `on_message`, and turn its
error into a string:

```rust,name=greeter/src/discord.rs
impl event_handler::Guest for Plugin {
    async fn event(kind: EventKind, payload: Vec<u8>) -> Result<(), String> {
        match kind {
            EventKind::MessageCreate => on_message(&payload).await,
            kind => unreachable!("not subscribed to {kind:?}"),
        }
        .map_err(|err| format!("{err:#}"))
    }
}
```

The plugin only receives the event kinds it subscribed to, so any other kind is
a bug.

The trait is named through its module, `event_handler::Guest`, since the
`interactions` world adds a second `Guest` to this file later.

Rebuild and restart, then send `!hello` in a channel the bot can read.
