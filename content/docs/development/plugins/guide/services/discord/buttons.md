+++
title = "Buttons"
description = "Add a button to the /hello reply."
weight = 3
+++

[Buttons](https://docs.discord.com/developers/components/reference#button) are
message components, and a plugin registers them as well. Import
`MessageComponent` and the builders for the button in `discord.rs`:

```rust,name=greeter/src/discord.rs
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

```rust,name=greeter/src/discord.rs
            resources::{ApplicationCommand, EventSubscription, MessageComponent},
```

## Registering the Button

Registering a `MessageComponent` generates the custom ID Discord identifies it
by. Like the command, the component stays registered when wpbs stops, so buttons
sent before a restart keep working. Registering it again has no effect and keeps
the custom ID:

```rust,name=greeter/src/discord.rs
async fn register_button() -> Result<(), String> {
    MessageComponent::new("wave")
        .register()
        .await
        .map_err(|err| err.to_string())
}
```

Call it from `register`:

```rust,name=greeter/src/discord.rs
    register_command().await?;
    register_button().await?;
```

## Sending the Button

In `interaction`, reply to the command with the greeting and the button, using
the button's custom ID. Buttons sit in an action row:

```rust,name=greeter/src/discord.rs
            (InteractionKind::ApplicationCommand, "hello") => {
                let custom_id = MessageComponent::new("wave")
                    .custom_id()
                    .await
                    .map_err(|err| err.to_string())?;

                let button = ButtonBuilder::new(ButtonStyle::Primary)
                    .custom_id(custom_id)
                    .label("Wave")
                    .build();

                ChannelMessageBuilder::new()
                    .content(Settings::load()?.greeting)
                    .components([ActionRowBuilder::new().component(button).build()])
                    .build()
            }
```

## Handling Clicks

A click sends another interaction, with the button's kind and key. Add an arm to
the `match` in `interaction`:

```rust,name=greeter/src/discord.rs
            (InteractionKind::MessageComponent, "wave") => {
                ChannelMessageBuilder::new().content("👋").build()
            }
```

## Next Steps

That completes the `greeter` plugin. The
[reference](@/docs/development/plugins/reference/_index.md) covers the rest of
the API, for building plugins of your own.
