+++
title = "Types"
description = "Event kinds, requests, routes, and voice types."
weight = 2
+++

## Interface `types`

Provides Discord event, interaction, request, and voice types.

### Enum `event-kind`

A kind of Discord event.

```wit
interface types {
    enum event-kind {
        auto-moderation-action-execution,
        auto-moderation-rule-create,
        auto-moderation-rule-delete,
        auto-moderation-rule-update,
        ban-add,
        ban-remove,
        channel-create,
        channel-delete,
        channel-pins-update,
        channel-update,
        command-permissions-update,
        entitlement-create,
        entitlement-delete,
        entitlement-update,
        guild-audit-log-entry-create,
        guild-create,
        guild-delete,
        guild-emojis-update,
        guild-integrations-update,
        guild-scheduled-event-create,
        guild-scheduled-event-delete,
        guild-scheduled-event-update,
        guild-scheduled-event-user-add,
        guild-scheduled-event-user-remove,
        guild-stickers-update,
        guild-update,
        integration-create,
        integration-delete,
        integration-update,
        interaction-create,
        invite-create,
        invite-delete,
        member-add,
        member-remove,
        member-update,
        member-chunk,
        message-create,
        message-delete,
        message-delete-bulk,
        message-poll-vote-add,
        message-poll-vote-remove,
        message-update,
        presence-update,
        rate-limited,
        reaction-add,
        reaction-remove,
        reaction-remove-all,
        reaction-remove-emoji,
        ready,
        resumed,
        role-create,
        role-delete,
        role-update,
        stage-instance-create,
        stage-instance-delete,
        stage-instance-update,
        subscription-create,
        subscription-delete,
        subscription-update,
        thread-create,
        thread-delete,
        thread-list-sync,
        thread-member-update,
        thread-members-update,
        thread-update,
        typing-start,
        unavailable-guild,
        user-update,
        voice-server-update,
        voice-state-update,
        webhooks-update,
    }
}
```

### Enum `interaction-kind`

A kind of Discord interaction.

```wit
interface types {
    enum interaction-kind {
        application-command,
        message-component,
        modal,
    }
}
```

### Type `snowflake`

A Discord ID.

```wit
interface types {
    type snowflake = u64;
}
```

### Type `reaction`

A reaction emoji, either a Unicode emoji or a custom emoji in `name:id`
form.

```wit
interface types {
    type reaction = string;
}
```

### Record `request`

A request to Discord.

```wit
interface types {
    record request {
        route: route,
        body: option<body>,
        headers: option<list<tuple<string, string>>>,
    }
}
```

### Variant `body`

A request body, either JSON or a multipart form.

```wit
interface types {
    variant body {
        json(json),
        form(form),
    }
}
```

### Record `form`

A multipart form body.

```wit
interface types {
    record form {
        boundary: list<u8, 15>,
        buffer: list<u8>,
    }
}
```

### Type `duration`

A duration in nanoseconds.

```wit
interface types {
    type duration = u64;
}
```

### Variant `play-mode`

A playback mode of a track.

A track waiting in the queue is in the `pause` mode.

```wit
interface types {
    variant play-mode {
        play,
        pause,
        stop,
        end,
        errored(string),
    }
}
```

### Record `track-info`

Information about a track.

The UUID tells whether two handles refer to the same track.

```wit
interface types {
    record track-info {
        uuid: string,
        playing: play-mode,
        volume: f32,
        position: duration,
    }
}
```

### Resource `track`

A handle to a queued track.

Dropping a handle does not stop the track.

#### Method `play`

Resumes a paused track.

Returns an error if:
- The track has ended.
- The track was not queued by the caller.

```wit
interface types {
    resource track {
        play: async func() -> result<_, host-error>;
    }
}
```

#### Method `pause`

Pauses a track.

Returns an error if:
- The track has ended.
- The track was not queued by the caller.

```wit
interface types {
    resource track {
        pause: async func() -> result<_, host-error>;
    }
}
```

#### Method `stop`

Stops a track.

A stopped track cannot be resumed.

Returns an error if:
- The track has ended.
- The track was not queued by the caller.

```wit
interface types {
    resource track {
        stop: async func() -> result<_, host-error>;
    }
}
```

#### Method `set-volume`

Sets the volume of a track.

A volume of `1.0` plays the audio unchanged.

Returns an error if:
- The track has ended.
- The track was not queued by the caller.

```wit
interface types {
    resource track {
        set-volume: async func(volume: f32) -> result<_, host-error>;
    }
}
```

#### Method `get-info`

Returns information about a track.

Returns an error if the track has ended.

```wit
interface types {
    resource track {
        get-info: async func() -> result<track-info, host-error>;
    }
}
```

### Record `voice-channel-info`

Information about a voice channel connection.

The channel ID is absent when no voice channel is joined. The tracks are
listed in playback order.

```wit
interface types {
    record voice-channel-info {
        channel-id: option<snowflake>,
        connected: bool,
        mute: bool,
        deaf: bool,
        tracks: list<track>,
    }
}
```

### Variant `route`

A Discord HTTP route or gateway command and its parameters.

```wit
interface types {
    variant route {
        request-guild-members(snowflake),
        update-voice-state(snowflake),
        update-presence,
        add-application-emoji(snowflake),
        add-guild-member(add-guild-member-params),
        add-member-role(add-member-role-params),
        add-thread-member(add-thread-member-params),
        consume-entitlement(consume-entitlement-params),
        create-auto-moderation-rule(snowflake),
        create-ban(create-ban-params),
        create-channel(snowflake),
        create-emoji(snowflake),
        create-forum-thread(snowflake),
        create-global-command(snowflake),
        create-guild,
        create-guild-command(create-guild-command-params),
        create-guild-from-template(string),
        create-guild-integration(snowflake),
        create-guild-prune(create-guild-prune-params),
        create-guild-scheduled-event(snowflake),
        create-guild-sticker(snowflake),
        create-invite(snowflake),
        create-message(snowflake),
        create-private-channel,
        create-reaction(create-reaction-params),
        create-role(snowflake),
        create-stage-instance,
        create-template(snowflake),
        create-test-entitlement(snowflake),
        create-thread(snowflake),
        create-thread-from-message(create-thread-from-message-params),
        create-typing-trigger(snowflake),
        create-webhook(snowflake),
        crosspost-message(crosspost-message-params),
        delete-application-emoji(delete-application-emoji-params),
        delete-auto-moderation-rule(delete-auto-moderation-rule-params),
        delete-ban(delete-ban-params),
        delete-channel(snowflake),
        delete-emoji(delete-emoji-params),
        delete-global-command(delete-global-command-params),
        delete-guild(snowflake),
        delete-guild-command(delete-guild-command-params),
        delete-guild-integration(delete-guild-integration-params),
        delete-guild-scheduled-event(delete-guild-scheduled-event-params),
        delete-guild-sticker(delete-guild-sticker-params),
        delete-interaction-original(delete-interaction-original-params),
        delete-invite(string),
        delete-message(delete-message-params),
        delete-message-reactions(delete-message-reactions-params),
        delete-message-specific-reaction(
            delete-message-specific-reaction-params
        ),
        delete-messages(snowflake),
        delete-permission-overwrite(delete-permission-overwrite-params),
        delete-reaction(delete-reaction-params),
        delete-reaction-current-user(delete-reaction-current-user-params),
        delete-role(delete-role-params),
        delete-stage-instance(snowflake),
        delete-template(delete-template-params),
        delete-webhook(delete-webhook-params),
        delete-webhook-message(delete-webhook-message-params),
        delete-test-entitlement(delete-test-entitlement-params),
        update-application-emoji(update-application-emoji-params),
        end-poll(end-poll-params),
        execute-webhook(execute-webhook-params),
        follow-news-channel(snowflake),
        get-active-threads(snowflake),
        get-application-emojis(snowflake),
        get-answer-voters(get-answer-voters-params),
        get-audit-logs(get-audit-logs-params),
        get-auto-moderation-rule(get-auto-moderation-rule-params),
        get-ban(get-ban-params),
        get-bans(snowflake),
        get-bans-with-parameters(get-bans-with-parameters-params),
        get-channel(snowflake),
        get-channel-invites(snowflake),
        get-channel-webhooks(snowflake),
        get-channels(snowflake),
        get-command-permissions(get-command-permissions-params),
        get-current-authorization-information,
        get-current-user,
        get-current-user-application-info,
        get-current-user-guild-member(snowflake),
        get-current-user-voice-state(snowflake),
        get-emoji(get-emoji-params),
        get-emojis(snowflake),
        get-entitlements(get-entitlements-params),
        get-entitlement(get-entitlement-params),
        get-followup-message(get-followup-message-params),
        get-gateway,
        get-gateway-bot,
        get-global-command(get-global-command-params),
        get-global-commands(get-global-commands-params),
        get-guild(get-guild-params),
        get-guild-auto-moderation-rules(snowflake),
        get-guild-command(get-guild-command-params),
        get-guild-command-permissions(get-guild-command-permissions-params),
        get-guild-commands(get-guild-commands-params),
        get-guild-integrations(snowflake),
        get-guild-invites(snowflake),
        get-guild-members(get-guild-members-params),
        get-guild-onboarding(snowflake),
        get-guild-preview(snowflake),
        get-guild-prune-count(get-guild-prune-count-params),
        get-guild-role-member-counts(snowflake),
        get-guild-roles(snowflake),
        get-guild-scheduled-event(get-guild-scheduled-event-params),
        get-guild-scheduled-event-users(get-guild-scheduled-event-users-params),
        get-guild-scheduled-events(get-guild-scheduled-events-params),
        get-guild-sticker(get-guild-sticker-params),
        get-guild-stickers(snowflake),
        get-guild-vanity-url(snowflake),
        get-guild-voice-regions(snowflake),
        get-guild-webhooks(snowflake),
        get-guild-welcome-screen(snowflake),
        get-guild-widget(snowflake),
        get-guild-widget-settings(snowflake),
        get-guilds(get-guilds-params),
        get-interaction-original(get-interaction-original-params),
        get-invite(get-invite-params),
        get-invite-with-expiration(get-invite-with-expiration-params),
        get-joined-private-archived-threads(
            get-joined-private-archived-threads-params
        ),
        get-member(get-member-params),
        get-message(get-message-params),
        get-messages(get-messages-params),
        get-nitro-sticker-packs,
        get-pins(get-pins-params),
        get-private-archived-threads(get-private-archived-threads-params),
        get-public-archived-threads(get-public-archived-threads-params),
        get-reaction-users(get-reaction-users-params),
        get-role(get-role-params),
        get-skus(snowflake),
        get-sku-subscriptions(get-sku-subscriptions-params),
        get-sku-subscription(get-sku-subscription-params),
        get-stage-instance(snowflake),
        get-sticker(snowflake),
        get-template(string),
        get-templates(snowflake),
        get-thread-member(get-thread-member-params),
        get-thread-members(get-thread-members-params),
        get-user(snowflake),
        get-user-connections,
        get-user-private-channels,
        get-user-voice-state(get-user-voice-state-params),
        get-voice-regions,
        get-webhook(get-webhook-params),
        get-webhook-message(get-webhook-message-params),
        interaction-callback(interaction-callback-params),
        join-thread(snowflake),
        leave-guild(snowflake),
        leave-thread(snowflake),
        pin-message(pin-message-params),
        remove-member(remove-member-params),
        remove-member-role(remove-member-role-params),
        remove-thread-member(remove-thread-member-params),
        search-guild-members(search-guild-members-params),
        set-global-commands(snowflake),
        set-guild-commands(set-guild-commands-params),
        sync-guild-integration(sync-guild-integration-params),
        sync-template(sync-template-params),
        unpin-message(unpin-message-params),
        update-auto-moderation-rule(update-auto-moderation-rule-params),
        update-channel(snowflake),
        update-command-permissions(update-command-permissions-params),
        update-current-member(snowflake),
        update-current-user,
        update-current-user-voice-state(snowflake),
        update-emoji(update-emoji-params),
        update-global-command(update-global-command-params),
        update-guild(snowflake),
        update-guild-channels(snowflake),
        update-guild-command(update-guild-command-params),
        update-guild-integration(update-guild-integration-params),
        update-guild-mfa(snowflake),
        update-guild-onboarding(snowflake),
        update-guild-scheduled-event(update-guild-scheduled-event-params),
        update-guild-sticker(update-guild-sticker-params),
        update-guild-welcome-screen(snowflake),
        update-guild-widget-settings(snowflake),
        update-interaction-original(update-interaction-original-params),
        update-member(update-member-params),
        update-message(update-message-params),
        update-nickname(snowflake),
        update-permission-overwrite(update-permission-overwrite-params),
        update-role(update-role-params),
        update-role-positions(snowflake),
        update-stage-instance(snowflake),
        update-template(update-template-params),
        update-user-voice-state(update-user-voice-state-params),
        update-webhook(update-webhook-params),
        update-webhook-message(update-webhook-message-params),
        update-current-user-application,
    }
}
```

### Route parameters

Records for `route` cases that take more than one value.

```wit
interface types {
    record add-guild-member-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record add-member-role-params {
        guild-id: snowflake,
        role-id: snowflake,
        user-id: snowflake,
    }

    record add-thread-member-params {
        channel-id: snowflake,
        user-id: snowflake,
    }

    record consume-entitlement-params {
        application-id: snowflake,
        entitlement-id: snowflake,
    }

    record create-ban-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record create-guild-command-params {
        application-id: snowflake,
        guild-id: snowflake,
    }

    record create-guild-prune-params {
        compute-prune-count: option<bool>,
        days: option<u16>,
        guild-id: snowflake,
        include-roles: list<snowflake>,
    }

    record create-reaction-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
    }

    record create-thread-from-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record crosspost-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record delete-application-emoji-params {
        application-id: snowflake,
        emoji-id: snowflake,
    }

    record delete-auto-moderation-rule-params {
        guild-id: snowflake,
        auto-moderation-rule-id: snowflake,
    }

    record delete-ban-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record delete-emoji-params {
        emoji-id: snowflake,
        guild-id: snowflake,
    }

    record delete-global-command-params {
        application-id: snowflake,
        command-id: snowflake,
    }

    record delete-guild-command-params {
        application-id: snowflake,
        command-id: snowflake,
        guild-id: snowflake,
    }

    record delete-guild-integration-params {
        guild-id: snowflake,
        integration-id: snowflake,
    }

    record delete-guild-scheduled-event-params {
        guild-id: snowflake,
        scheduled-event-id: snowflake,
    }

    record delete-guild-sticker-params {
        guild-id: snowflake,
        sticker-id: snowflake,
    }

    record delete-interaction-original-params {
        application-id: snowflake,
        interaction-token: string,
    }

    record delete-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record delete-message-reactions-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record delete-message-specific-reaction-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
    }

    record delete-permission-overwrite-params {
        channel-id: snowflake,
        target-id: snowflake,
    }

    record delete-reaction-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
        user-id: snowflake,
    }

    record delete-reaction-current-user-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
    }

    record delete-role-params {
        guild-id: snowflake,
        role-id: snowflake,
    }

    record delete-template-params {
        guild-id: snowflake,
        template-code: string,
    }

    record delete-webhook-params {
        token: option<string>,
        webhook-id: snowflake,
    }

    record delete-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }

    record delete-test-entitlement-params {
        application-id: snowflake,
        entitlement-id: snowflake,
    }

    record update-application-emoji-params {
        application-id: snowflake,
        emoji-id: snowflake,
    }

    record end-poll-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record execute-webhook-params {
        thread-id: option<snowflake>,
        token: string,
        wait: option<bool>,
        with-components: option<bool>,
        webhook-id: snowflake,
    }

    record get-answer-voters-params {
        after: option<snowflake>,
        answer-id: u8,
        channel-id: snowflake,
        limit: option<u8>,
        message-id: snowflake,
    }

    record get-audit-logs-params {
        action-type: option<u64>,
        after: option<snowflake>,
        before: option<snowflake>,
        guild-id: snowflake,
        limit: option<u16>,
        user-id: option<snowflake>,
    }

    record get-auto-moderation-rule-params {
        guild-id: snowflake,
        auto-moderation-rule-id: snowflake,
    }

    record get-ban-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record get-bans-with-parameters-params {
        after: option<snowflake>,
        before: option<snowflake>,
        limit: option<u16>,
        guild-id: snowflake,
    }

    record get-command-permissions-params {
        application-id: snowflake,
        command-id: snowflake,
        guild-id: snowflake,
    }

    record get-emoji-params {
        emoji-id: snowflake,
        guild-id: snowflake,
    }

    record get-entitlements-params {
        after: option<snowflake>,
        application-id: snowflake,
        before: option<snowflake>,
        exclude-deleted: option<bool>,
        exclude-ended: option<bool>,
        guild-id: option<snowflake>,
        limit: option<u8>,
        sku-ids: list<snowflake>,
        user-id: option<snowflake>,
    }

    record get-entitlement-params {
        application-id: snowflake,
        entitlement-id: snowflake,
    }

    record get-followup-message-params {
        application-id: snowflake,
        interaction-token: string,
        thread-id: option<snowflake>,
        message-id: snowflake,
    }

    record get-global-command-params {
        application-id: snowflake,
        command-id: snowflake,
    }

    record get-global-commands-params {
        application-id: snowflake,
        with-localizations: option<bool>,
    }

    record get-guild-params {
        guild-id: snowflake,
        with-counts: bool,
    }

    record get-guild-command-params {
        application-id: snowflake,
        command-id: snowflake,
        guild-id: snowflake,
    }

    record get-guild-command-permissions-params {
        application-id: snowflake,
        guild-id: snowflake,
    }

    record get-guild-commands-params {
        application-id: snowflake,
        guild-id: snowflake,
        with-localizations: option<bool>,
    }

    record get-guild-members-params {
        after: option<snowflake>,
        guild-id: snowflake,
        limit: option<u16>,
    }

    record get-guild-prune-count-params {
        days: option<u16>,
        guild-id: snowflake,
        include-roles: list<snowflake>,
    }

    record get-guild-scheduled-event-params {
        guild-id: snowflake,
        scheduled-event-id: snowflake,
        with-user-count: bool,
    }

    record get-guild-scheduled-event-users-params {
        after: option<snowflake>,
        before: option<snowflake>,
        guild-id: snowflake,
        limit: option<u16>,
        scheduled-event-id: snowflake,
        with-member: bool,
    }

    record get-guild-scheduled-events-params {
        guild-id: snowflake,
        with-user-count: bool,
    }

    record get-guild-sticker-params {
        guild-id: snowflake,
        sticker-id: snowflake,
    }

    record get-guilds-params {
        after: option<snowflake>,
        before: option<snowflake>,
        limit: option<u16>,
    }

    record get-interaction-original-params {
        application-id: snowflake,
        interaction-token: string,
    }

    record get-invite-params {
        code: string,
        with-counts: bool,
    }

    record get-invite-with-expiration-params {
        code: string,
        with-counts: bool,
        with-expiration: bool,
    }

    record get-joined-private-archived-threads-params {
        before: option<snowflake>,
        channel-id: snowflake,
        limit: option<u64>,
    }

    record get-member-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record get-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record get-messages-params {
        after: option<snowflake>,
        around: option<snowflake>,
        before: option<snowflake>,
        channel-id: snowflake,
        limit: option<u16>,
    }

    record get-pins-params {
        channel-id: snowflake,
        limit: option<u16>,
        before: option<string>,
    }

    record get-private-archived-threads-params {
        before: option<string>,
        channel-id: snowflake,
        limit: option<u64>,
    }

    record get-public-archived-threads-params {
        before: option<string>,
        channel-id: snowflake,
        limit: option<u64>,
    }

    record get-reaction-users-params {
        after: option<snowflake>,
        channel-id: snowflake,
        emoji: reaction,
        limit: option<u16>,
        message-id: snowflake,
        kind: option<u8>,
    }

    record get-role-params {
        guild-id: snowflake,
        role-id: snowflake,
    }

    record get-sku-subscriptions-params {
        after: option<snowflake>,
        before: option<snowflake>,
        limit: option<u64>,
        sku-id: snowflake,
        user-id: option<snowflake>,
    }

    record get-sku-subscription-params {
        sku-id: snowflake,
        subscription-id: snowflake,
    }

    record get-thread-member-params {
        channel-id: snowflake,
        user-id: snowflake,
    }

    record get-thread-members-params {
        after: option<snowflake>,
        channel-id: snowflake,
        limit: option<u32>,
        with-member: option<bool>,
    }

    record get-user-voice-state-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record get-webhook-params {
        token: option<string>,
        webhook-id: snowflake,
    }

    record get-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }

    record interaction-callback-params {
        interaction-id: snowflake,
        interaction-token: string,
        with-response: bool,
    }

    record pin-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record remove-member-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record remove-member-role-params {
        guild-id: snowflake,
        role-id: snowflake,
        user-id: snowflake,
    }

    record remove-thread-member-params {
        channel-id: snowflake,
        user-id: snowflake,
    }

    record search-guild-members-params {
        guild-id: snowflake,
        limit: option<u16>,
        query: string,
    }

    record set-guild-commands-params {
        application-id: snowflake,
        guild-id: snowflake,
    }

    record sync-guild-integration-params {
        guild-id: snowflake,
        integration-id: snowflake,
    }

    record sync-template-params {
        guild-id: snowflake,
        template-code: string,
    }

    record unpin-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record update-auto-moderation-rule-params {
        auto-moderation-rule-id: snowflake,
        guild-id: snowflake,
    }

    record update-command-permissions-params {
        application-id: snowflake,
        command-id: snowflake,
        guild-id: snowflake,
    }

    record update-emoji-params {
        emoji-id: snowflake,
        guild-id: snowflake,
    }

    record update-global-command-params {
        application-id: snowflake,
        command-id: snowflake,
    }

    record update-guild-command-params {
        application-id: snowflake,
        command-id: snowflake,
        guild-id: snowflake,
    }

    record update-guild-integration-params {
        guild-id: snowflake,
        integration-id: snowflake,
    }

    record update-guild-scheduled-event-params {
        guild-id: snowflake,
        scheduled-event-id: snowflake,
    }

    record update-guild-sticker-params {
        guild-id: snowflake,
        sticker-id: snowflake,
    }

    record update-interaction-original-params {
        application-id: snowflake,
        interaction-token: string,
    }

    record update-member-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record update-message-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record update-permission-overwrite-params {
        channel-id: snowflake,
        target-id: snowflake,
    }

    record update-role-params {
        guild-id: snowflake,
        role-id: snowflake,
    }

    record update-template-params {
        guild-id: snowflake,
        template-code: string,
    }

    record update-user-voice-state-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record update-webhook-params {
        token: option<string>,
        webhook-id: snowflake,
    }

    record update-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }
}
```
