+++
title = "Plugins"
description = "Add plugins and their settings."
weight = 2
+++

Each entry under `plugins` runs one plugin. The key names it:

```yaml,name=config.yaml
plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
```

A plugin that cannot be loaded or fails to initialize is logged and left out;
wpbs runs the others.

## Sources

`plugin` has the form `namespace/name:version`, with an exact version:

- Published plugins come from OCI registries, public or private, the same kind
  that hosts container images. wpbs downloads each one once, and stores it as
  `plugins/binaries/<namespace>/<name>/<version>/plugin.wasm`.
- The `local` namespace loads your own plugin from
  `plugins/binaries/local/<name>/<version>/plugin.wasm`.

## Settings and Environment

`settings` configures the plugin, and `environment` sets environment variables
for it:

```yaml,name=config.yaml
plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
    settings:
      greeting: Good morning!
    environment:
      SECRET_GREETING: ${HELLO_WORLD_SECRET_GREETING}
```

## Working Directory

Each entry gets a working directory for files, in
`plugins/workspaces/<project name>/<key>`.

## Duplicate Plugins

The same plugin can be added more than once under different keys, such as
`hello-world` and `hello-world-dev`. Each entry has its own settings, data, and
working directory. The data belongs to the key, so an entry that is renamed
starts without it.
