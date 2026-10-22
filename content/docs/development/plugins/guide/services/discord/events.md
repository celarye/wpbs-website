+++
title = "Events"
description = "Reply to messages that say !hello."
weight = 1
+++

Event payloads are Discord's JSON, and requests to Discord carry JSON bodies.
[twilight](https://github.com/wpbs-rs/twilight) has Rust types for the payloads
in `twilight-model`, and builds requests with the client in `twilight-http`. Add
both to the workspace's `Cargo.toml`, along with Tokio, which the client relies
on:

```toml,name=Cargo.toml
tokio = { version = "1", features = ["rt"] }
twilight-http = { git = "https://github.com/wpbs-rs/twilight", default-features = false }
twilight-model = { git = "https://github.com/wpbs-rs/twilight" }
```

wpbs sends the requests, so the client needs none of its default features, such
as TLS. Add the crates to `greeter/Cargo.toml` as well:

```toml,name=greeter/Cargo.toml
tokio.workspace = true
twilight-http.workspace = true
twilight-model.workspace = true
```

The client uses parts of Tokio that WebAssembly only supports as unstable
features. Enable them in `.cargo/config.toml`:

```toml,name=.cargo/config.toml
[build]
target = "wasm32-wasip3"
rustflags = ["--cfg", "tokio_unstable"]
```

Then replace the imports in `discord.rs` with the ones this page needs:

```rust,name=greeter/src/discord.rs
use twilight_http::{Client, request::TryIntoRequest};
use twilight_model::gateway::payload::incoming::MessageCreate;

use crate::{
    Plugin,
    bindings::discord::{
        exports::wpbs_services::discord::export_functions::Guest,
        wpbs_services::discord::{
            import_functions::request, resources::EventSubscription, types::*,
        },
    },
    settings::Settings,
};
```

## Subscribing

A plugin only receives the event kinds it subscribes to. Like the job, its
subscription is a registration that lasts until wpbs stops, so it is registered
on every start:

```rust,name=greeter/src/discord.rs
async fn subscribe() -> Result<(), String> {
    EventSubscription::new()
        .register(vec![EventKind::MessageCreate])
        .await
        .map_err(|err| err.to_string())
}
```

Call it from `register`:

```rust,name=greeter/src/discord.rs
pub async fn register() -> Result<(), String> {
    subscribe().await?;

    Ok(())
}
```

## Handling Messages

`event` receives the event's kind and its JSON payload. Replace the empty one
with one that passes new messages on to a handler:

```rust,name=greeter/src/discord.rs
    async fn event(kind: EventKind, payload: Vec<u8>) -> Result<(), String> {
        match kind {
            EventKind::MessageCreate => on_message(&payload).await,
            _ => Ok(()),
        }
    }
```

## Building Requests

The client builds a request, and the plugin passes its body on to wpbs. Add a
helper for each:

```rust,name=greeter/src/discord.rs
fn client() -> Result<Client, String> {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .build()
        .map_err(|err| err.to_string())?;
    let _guard = runtime.enter();

    Ok(Client::builder().ratelimiter(None).build())
}

fn body(request: impl TryIntoRequest) -> Result<Option<Body>, String> {
    let request = request.try_into_request().map_err(|err| err.to_string())?;

    Ok(request.body().map(|body| Body::Json(body.to_vec())))
}
```

wpbs applies Discord's rate limits itself, so the client goes without its own.
Its builder still starts a rate limiter task, which needs a Tokio runtime to be
entered. A single-threaded runtime is enough, as the task never runs.

## Replying

The handler replies with a
[Create Message](https://docs.discord.com/developers/resources/message#create-message)
request. `Route` selects the endpoint and its parameters, and the client builds
the body:

```rust,name=greeter/src/discord.rs
async fn on_message(payload: &[u8]) -> Result<(), String> {
    let message: MessageCreate = serde_json::from_slice(payload).map_err(|err| err.to_string())?;

    if message.content != "!hello" {
        return Ok(());
    }

    let greeting = Settings::load()?.greeting;
    let client = client()?;

    request(Request {
        route: Route::CreateMessage(message.channel_id.get()),
        body: body(client.create_message(message.channel_id).content(&greeting))?,
        headers: None,
    })
    .await
    .map_err(|err| err.to_string())?;

    Ok(())
}
```

Rebuild and restart, then send `!hello` in a channel the bot can read.
