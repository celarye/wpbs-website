+++
title = "Discord"
description = "Discord events, requests, interactions, and voice channels."
weight = 2
sort_by = "weight"

[extra]
children_heading = "Interfaces"
+++

Package `wpbs-services:discord`.

## World `events`

Provides Discord events.

```wit
world events {
    import subscriptions;
    export event-handler;
}
```

## World `requests`

Provides Discord requests.

```wit
world requests {
    import client;
}
```

## World `interactions`

Provides Discord interactions.

```wit
world interactions {
    import registrations;
    export interaction-handler;
}
```

## World `voice`

Provides Discord voice channels.

```wit
world voice {
    import voice-channels;
}
```
