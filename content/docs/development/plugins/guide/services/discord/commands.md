+++
title = "Commands"
description = "Add a /hello command."
weight = 2
+++

Discord's
[application commands](https://docs.discord.com/developers/interactions/application-commands)
are registrations too. `twilight-util` has builders for the commands and the
responses this page needs. Add it to the workspace's `Cargo.toml`:

```toml,name=Cargo.toml
twilight-util = { git = "https://github.com/wpbs-rs/twilight", features = ["builder"] }
```

and to `greeter/Cargo.toml`:

```toml,name=greeter/Cargo.toml
twilight-util.workspace = true
```

Then update the imports in `discord.rs`:

```rust,name=greeter/src/discord.rs
use twilight_http::{Client, request::TryIntoRequest};
use twilight_model::{
    application::{command::CommandType, interaction::Interaction},
    gateway::payload::incoming::MessageCreate,
    http::interaction::InteractionResponse,
};
use twilight_util::builder::{
    command::CommandBuilder, interaction_response::ChannelMessageBuilder,
};
```

```rust,name=greeter/src/discord.rs
            resources::{ApplicationCommand, EventSubscription},
```

## Registering the Command

An `ApplicationCommand` is a handle named by a key. Registering it with `None`
creates a global command, described by Discord's command object:

```rust,name=greeter/src/discord.rs
async fn register_command() -> Result<(), String> {
    let command = CommandBuilder::new("hello", "Say hello", CommandType::ChatInput).build();
    let data = serde_json::to_vec(&command).map_err(|err| err.to_string())?;

    ApplicationCommand::new("hello")
        .register(None, data)
        .await
        .map_err(|err| err.to_string())
}
```

Unlike the subscription, the command stays registered with Discord when wpbs
stops. Registering it on the next start has no effect, or updates it if its data
changed.

Call it from `register`:

```rust,name=greeter/src/discord.rs
    subscribe().await?;
    register_command().await?;
```

## Receiving the Command

Using the command sends the plugin an interaction, which needs no subscription.
wpbs calls `interaction` with the kind and key of the command, so the plugin
matches on those. The key stays the same even if wpbs renames the command, such
as to `hello-1` when another command also uses `hello`. Replace the empty
`interaction`:

```rust,name=greeter/src/discord.rs
    async fn interaction(
        kind: InteractionKind,
        key: String,
        payload: Vec<u8>,
    ) -> Result<(), String> {
        let interaction: Interaction =
            serde_json::from_slice(&payload).map_err(|err| err.to_string())?;

        let response = match (kind, key.as_str()) {
            (InteractionKind::ApplicationCommand, "hello") => ChannelMessageBuilder::new()
                .content(Settings::load()?.greeting)
                .build(),
            _ => return Ok(()),
        };

        respond(&interaction, &response).await
    }
```

## Responding

Discord expects an
[interaction response](https://docs.discord.com/developers/interactions/receiving-and-responding)
within three seconds. `ChannelMessageBuilder` builds one that replies with a
message, and the client builds the request's body:

```rust,name=greeter/src/discord.rs
async fn respond(interaction: &Interaction, response: &InteractionResponse) -> Result<(), String> {
    let client = client()?;
    let interaction_client = client.interaction(interaction.application_id);
    let callback = interaction_client.create_response(interaction.id, &interaction.token, response);

    request(Request {
        route: Route::InteractionCallback(InteractionCallbackParams {
            interaction_id: interaction.id.get(),
            interaction_token: interaction.token.clone(),
            with_response: false,
        }),
        body: body(callback)?,
        headers: None,
    })
    .await
    .map_err(|err| err.to_string())?;

    Ok(())
}
```
