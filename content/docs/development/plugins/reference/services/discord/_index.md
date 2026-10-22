+++
title = "Discord"
description = "Discord requests and events."
weight = 2
sort_by = "weight"
+++

Package `wpbs-services:discord`.

## World `discord`

Provides Discord requests, events, interactions, and voice channels.

```wit
world discord {
    import resources;
    import import-functions;
    export export-functions;
}
```

## Interface `import-functions`

Provides requests to Discord.

### Function `request`

Sends a request to Discord and returns its response.

Responses are Discord JSON payloads, or JSON `null` if empty.

Gateway routes return an empty response once the request is accepted for
sending. Members requested through `request-guild-members` arrive as
`member-chunk` events.

Returns an error if:
- The Discord service is disabled.
- The plugin does not have permission for the route.
- The route is not supported.
- The request is invalid or rejected by Discord.

```wit
interface import-functions {
    request: async func(request: request-data) -> result<json, host-error>;
}
```

## Interface `export-functions`

Provides callbacks that handle Discord events and interactions.

### Function `event`

Handles a Discord event of the provided kind.

Called for events which have been subscribed to.

The payload is the event's Discord JSON data, or JSON `null` for events
without data, such as `resumed`.

```wit
interface export-functions {
    event: async func(
        kind: event-kind,
        payload: json,
    ) -> result<_, plugin-error>;
}
```

### Function `interaction`

Handles a Discord interaction with a registered application command,
message component, or modal.

The kind and key identify the resource the interaction belongs to. The
payload is the interaction's Discord JSON data.

```wit
interface export-functions {
    interaction: async func(
        kind: interaction-kind,
        key: string,
        payload: json,
    ) -> result<_, plugin-error>;
}
```
