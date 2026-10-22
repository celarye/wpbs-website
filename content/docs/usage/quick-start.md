+++
title = "Quick Start"
description = "Download wpbs and run a first project."
weight = 1
+++

## Installation

Install the latest release of wpbs for your system with its install script:

{% <tabs> %}
{% <tab title="macOS/Linux"> %}
```sh
curl -fsSL https://raw.githubusercontent.com/wpbs-rs/wpbs/main/install.sh | sh
```
{% </tab> %}
{% <tab title="Windows"> %}
```powershell
irm 'https://raw.githubusercontent.com/wpbs-rs/wpbs/main/install.ps1' | iex
```
{% </tab> %}
{% </tabs> %}

> [Installation](@/docs/usage/installation.md) covers other options, such as
> Docker.

## Configuration

Create a directory for the project:

```sh
mkdir my-project
cd my-project
```

In it, add a `config.yaml` that runs `hello-world`, a plugin that logs
`Hello, world!` when wpbs starts and `Goodbye, world!` when it stops:

```yaml,name=config.yaml
plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
```

> [Configuration](@/docs/usage/configuration/_index.md) covers everything
> `config.yaml` can describe, such as services and plugin settings.

## Running

Start wpbs from the project's directory:

```sh
wpbs
```

On its first start, wpbs downloads the plugin, which then logs its greeting.

Stop wpbs with Ctrl+C, and the plugin says goodbye. Pressing Ctrl+C again forces
wpbs to shut down without waiting for plugins to finish.

## Data

wpbs creates three directories in the directory it runs from:

- `plugins`: plugin files.
- `database`: plugin and service data. Keep it across updates and back it up;
  without it, every plugin starts from scratch.
- `logs`: log files.

Secrets, such as tokens, go in a `.env` file in that directory.

## Next Steps

Replace `hello-world` with the services and plugins your project needs. Restart
wpbs to apply configuration changes.
