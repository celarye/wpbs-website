+++
title = "Permissions"
description = "Optionally restrict plugins further."
weight = 3
+++

Plugins run [sandboxed](@/docs/_index.md#sandboxed), so they can only use what
wpbs provides. By default, permissions are opt-out: plugins may use every
operation of the enabled services, which suits most projects.

A plugin entry can narrow this down under `permissions`:

```yaml,name=config.yaml
plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
    permissions:
      services:
        scheduler:
          - Jobs
```

`core` covers wpbs itself, such as `Shutdown` for requests to stop or restart
it, and `services` has a list per service. Each list also accepts `All`.
Registrations and calls a plugin has no permission for fail. A plugin's
documentation lists the permissions it needs.

## Restricted Mode

Restricted mode makes permissions opt-in: a list that an entry leaves out allows
nothing instead of everything, so each plugin only gets what its entry lists.
Restricted mode is for advanced use. As a binary, run `wpbs --restricted`. With
`docker run`, add `--restricted` after the image name; through Docker Compose,
set the command:

```yaml,name=compose.yaml
services:
  wpbs:
    command: ["/wpbs", "--restricted"]
```
