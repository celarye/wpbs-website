+++
title = "Buttons"
description = "Add a button to the /hello reply."
weight = 3
+++

[Buttons](https://docs.discord.com/developers/components/reference#button) are
message components, and a plugin registers them as well. Import
`MessageComponent` and the builders for the button in `discord.rs`:

```rust,name=greeter/src/discord.rs,hl_lines=3 10
use twilight_model::{
    application::{command::CommandType, interaction::Interaction},
    channel::message::component::ButtonStyle,
    gateway::payload::incoming::MessageCreate,
    http::interaction::InteractionResponse,
};
use twilight_util::builder::{
    command::CommandBuilder,
    interaction_response::ChannelMessageBuilder,
    message::{ActionRowBuilder, ButtonBuilder},
};
```

```rust,name=greeter/src/discord.rs,hl_lines=3-5
        interactions::{
            exports::wpbs_services::discord::interaction_handler,
            wpbs_services::discord::registrations::{
                ApplicationCommand, InteractionKind, MessageComponent,
            },
        },
```

## Registering the Button

Registering a `MessageComponent` generates the custom ID Discord identifies it
by. Like the command, the component stays registered when wpbs stops, so buttons
sent before a restart keep working. Registering it again has no effect and keeps
the custom ID:

```rust,name=greeter/src/discord.rs
async fn register_button() -> anyhow::Result<()> {
    MessageComponent::new("wave").register().await?;

    Ok(())
}
```

Call it from `register`:

```rust,name=greeter/src/discord.rs,hl_lines=4
pub async fn register() -> anyhow::Result<()> {
    subscribe().await?;
    register_command().await?;
    register_button().await?;

    Ok(())
}
```

## Sending the Button

In `on_hello`, reply with the greeting and the button, using the button's custom
ID. Buttons sit in an action row:

```rust,name=greeter/src/discord.rs,hl_lines=4-10 13
async fn on_hello(payload: &[u8]) -> anyhow::Result<()> {
    let interaction: Interaction = serde_json::from_slice(payload)?;

    let custom_id = MessageComponent::new("wave").custom_id().await?;

    let button = ButtonBuilder::new(ButtonStyle::Primary)
        .custom_id(custom_id)
        .label("Wave")
        .build();

    let response = ChannelMessageBuilder::new()
        .content(Settings::load()?.greeting)
        .components([ActionRowBuilder::new().component(button).build()])
        .build();

    respond(&interaction, &response).await
}
```

## Handling Clicks

A click sends another interaction, with the button's kind and key. A handler,
`on_wave`, replies to it with a wave:

```rust,name=greeter/src/discord.rs
async fn on_wave(payload: &[u8]) -> anyhow::Result<()> {
    let interaction: Interaction = serde_json::from_slice(payload)?;

    let response = ChannelMessageBuilder::new().content("👋").build();

    respond(&interaction, &response).await
}
```

Add an arm for it to the `match` in `interaction`:

```rust,name=greeter/src/discord.rs,hl_lines=3
        match (kind, key.as_str()) {
            (InteractionKind::ApplicationCommand, "hello") => on_hello(&payload).await,
            (InteractionKind::MessageComponent, "wave") => on_wave(&payload).await,
            (kind, key) => unreachable!("{kind:?} {key} was never registered"),
        }
```

## Next Steps

That completes the `greeter` plugin. The
[reference](@/docs/development/plugins/reference/_index.md) covers the rest of
the API, for building plugins of your own.
