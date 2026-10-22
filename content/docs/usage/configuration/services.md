+++
title = "Services"
description = "Enable and configure services."
weight = 1
+++

Services are off by default. Plugins that use a disabled service still get
initialized, but their registrations and calls will fail. Some services also
need settings and/or secrets.

{% <collapsible title="Discord"> %}
Connects to Discord. Create an application as described in Discord's
[getting started guide](https://docs.discord.com/developers/quick-start/getting-started),
and put its bot token in `.env`, in the directory wpbs runs from:

```sh,name=.env
DISCORD_BOT_TOKEN=your-token
```

wpbs does not start without the token while the service is enabled.

Enable the service with the
[gateway intents](https://docs.discord.com/developers/events/gateway#gateway-intents)
your plugins need. Their documentation lists them.

```yaml,name=config.yaml
services:
  discord:
    enabled: true
    settings:
      intents:
        - Guilds
        - GuildMessages
```

Intents use Discord's names in PascalCase, and `All` and `AllNonPrivileged`
select several at once. Without intents, plugins only receive interactions.
Privileged intents, such as `MessageContent`, must also be enabled for the bot
in Discord's developer portal.

### Interactions

Commands, message components, and modals that plugins register stay registered
while wpbs is stopped. Commands stay listed in Discord, and components and
modals sent before a restart work again once wpbs runs. On start, wpbs removes
the ones plugins no longer register, including those of removed or renamed
plugin entries.

Commands that share a name get numbered names, such as `/hello-1` and
`/hello-2`.
{% </collapsible> %}

{% <collapsible title="Scheduler"> %}
Runs plugin jobs on cron schedules. Schedules follow the system's time zone,
which is UTC in the Docker image unless `TZ` is set, such as
`TZ: Europe/Brussels`.

```yaml,name=config.yaml
services:
  scheduler:
    enabled: true
```
{% </collapsible> %}
