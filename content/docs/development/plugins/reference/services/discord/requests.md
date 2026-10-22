+++
title = "Requests"
description = "The client interface."
weight = 3
+++

## Interface `client`

Provides requests to Discord.

Every operation that returns a `host-error` fails with `unavailable` if
the Discord service is disabled or unreachable.

### Function `request`

Sends a request to Discord and returns its response.

Responses are Discord JSON payloads, or JSON `null` if empty.

Gateway routes return an empty response once the request is accepted for
sending. Members requested through `request-guild-members` arrive as
`member-chunk` events.

Returns an error if:
- The plugin does not have permission for the route
  (`permission-denied`).
- The route is not supported (`invalid-argument`).
- The request is invalid (`invalid-argument`).
- The request is rejected by Discord (`other`).

```wit
interface client {
    request: async func(request: request-data) -> result<json, host-error>;
}
```

### Record `request-data`

A request to Discord.

```wit
interface client {
    record request-data {
        route: route,
        body: option<body>,
        headers: option<list<tuple<string, string>>>,
    }
}
```

### Variant `body`

A request body, either JSON or a multipart form.

```wit
interface client {
    variant body {
        json(json),
        form(form),
    }
}
```

### Record `form`

A multipart form body.

```wit
interface client {
    record form {
        boundary: list<u8, 15>,
        buffer: list<u8>,
    }
}
```

### Variant `route`

A Discord HTTP route or gateway command and its parameters.

Routes with a single ID or code take the one in their Discord path.

```wit
interface client {
    variant route {
        request-guild-members(snowflake),
        update-presence,
        add-application-emoji(snowflake),
        add-guild-member(add-guild-member-params),
        add-member-role(add-member-role-params),
        add-thread-member(add-thread-member-params),
        bulk-guild-ban(snowflake),
        consume-entitlement(consume-entitlement-params),
        create-auto-moderation-rule(snowflake),
        create-ban(create-ban-params),
        create-channel(snowflake),
        create-emoji(snowflake),
        create-forum-thread(snowflake),
        create-guild,
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
        delete-guild(snowflake),
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
        delete-test-entitlement(delete-test-entitlement-params),
        delete-webhook(delete-webhook-params),
        delete-webhook-message(delete-webhook-message-params),
        end-poll(end-poll-params),
        execute-webhook(execute-webhook-params),
        follow-news-channel(snowflake),
        get-active-threads(snowflake),
        get-answer-voters(get-answer-voters-params),
        get-application-emojis(snowflake),
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
        get-entitlement(get-entitlement-params),
        get-entitlements(get-entitlements-params),
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
        get-sku-subscription(get-sku-subscription-params),
        get-sku-subscriptions(get-sku-subscriptions-params),
        get-skus(snowflake),
        get-stage-instance(snowflake),
        get-sticker(snowflake),
        get-sticker-pack(snowflake),
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
        sync-guild-integration(sync-guild-integration-params),
        sync-template(sync-template-params),
        unpin-message(unpin-message-params),
        update-application-emoji(update-application-emoji-params),
        update-auto-moderation-rule(update-auto-moderation-rule-params),
        update-channel(snowflake),
        update-command-permissions(update-command-permissions-params),
        update-current-member(snowflake),
        update-current-user,
        update-current-user-application,
        update-current-user-voice-state(snowflake),
        update-emoji(update-emoji-params),
        update-guild(snowflake),
        update-guild-channels(snowflake),
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
    }
}
```

### Variant `reaction`

A reaction emoji, either a Unicode emoji or the ID of a custom emoji.

```wit
interface client {
    variant reaction {
        unicode(string),
        custom(snowflake),
    }
}
```

### Route parameters

Records for `route` cases that take more than one value.

```wit
interface client {
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
        auto-moderation-rule-id: snowflake,
        guild-id: snowflake,
    }

    record delete-ban-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record delete-emoji-params {
        emoji-id: snowflake,
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

    record delete-reaction-current-user-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
    }

    record delete-reaction-params {
        channel-id: snowflake,
        emoji: reaction,
        message-id: snowflake,
        user-id: snowflake,
    }

    record delete-role-params {
        guild-id: snowflake,
        role-id: snowflake,
    }

    record delete-template-params {
        guild-id: snowflake,
        template-code: string,
    }

    record delete-test-entitlement-params {
        application-id: snowflake,
        entitlement-id: snowflake,
    }

    record delete-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }

    record delete-webhook-params {
        token: option<string>,
        webhook-id: snowflake,
    }

    record end-poll-params {
        channel-id: snowflake,
        message-id: snowflake,
    }

    record execute-webhook-params {
        thread-id: option<snowflake>,
        token: string,
        wait: option<bool>,
        webhook-id: snowflake,
        with-components: option<bool>,
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
        auto-moderation-rule-id: snowflake,
        guild-id: snowflake,
    }

    record get-ban-params {
        guild-id: snowflake,
        user-id: snowflake,
    }

    record get-bans-with-parameters-params {
        after: option<snowflake>,
        before: option<snowflake>,
        guild-id: snowflake,
        limit: option<u16>,
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

    record get-entitlement-params {
        application-id: snowflake,
        entitlement-id: snowflake,
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

    record get-followup-message-params {
        application-id: snowflake,
        interaction-token: string,
        message-id: snowflake,
        thread-id: option<snowflake>,
    }

    record get-global-command-params {
        application-id: snowflake,
        command-id: snowflake,
    }

    record get-global-commands-params {
        application-id: snowflake,
        with-localizations: option<bool>,
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

    record get-guild-params {
        guild-id: snowflake,
        with-counts: bool,
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
        shard: option<u64>,
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
        before: option<string>,
        channel-id: snowflake,
        limit: option<u16>,
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
        kind: option<u8>,
        limit: option<u16>,
        message-id: snowflake,
    }

    record get-role-params {
        guild-id: snowflake,
        role-id: snowflake,
    }

    record get-sku-subscription-params {
        sku-id: snowflake,
        subscription-id: snowflake,
    }

    record get-sku-subscriptions-params {
        after: option<snowflake>,
        before: option<snowflake>,
        limit: option<u64>,
        sku-id: snowflake,
        user-id: option<snowflake>,
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

    record get-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }

    record get-webhook-params {
        token: option<string>,
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

    record update-application-emoji-params {
        application-id: snowflake,
        emoji-id: snowflake,
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

    record update-webhook-message-params {
        message-id: snowflake,
        thread-id: option<snowflake>,
        token: string,
        webhook-id: snowflake,
    }

    record update-webhook-params {
        token: option<string>,
        webhook-id: snowflake,
    }
}
```
