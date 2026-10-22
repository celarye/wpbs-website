+++
title = "Installation"
description = "Install wpbs as a binary or run it with Docker."
weight = 2
+++

wpbs runs as a single binary, or as a Docker image.

{% <collapsible title="Binary"> %}
The install script installs the latest release for your system:

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

Or download the archive for your system from the
[releases page](https://github.com/wpbs-rs/wpbs/releases) yourself. Builds are
available for Linux, macOS, and Windows, on x86-64 and ARM64. Extract the
`wpbs` binary from it, and put it on your `PATH`.

Check that it works:

```sh
wpbs --version
```

`wpbs --help` lists its options, such as other locations for the files and
directories it uses.
{% </collapsible> %}

{% <collapsible title="Docker"> %}
The image keeps the configuration and the data wpbs creates in the project's
directory through volumes. Run it from that directory with Docker:

```sh
docker run --name wpbs \
  --restart unless-stopped \
  --env-file .env \
  -v ./config.yaml:/config.yaml \
  -v ./plugins:/plugins \
  -v ./database:/database \
  ghcr.io/wpbs-rs/wpbs:0.1.0
```

Or add a `compose.yaml` to the directory, and start it with
`docker compose up`:

```yaml,name=compose.yaml
services:
  wpbs:
    image: ghcr.io/wpbs-rs/wpbs:0.1.0
    env_file: .env
    volumes:
      - ./config.yaml:/config.yaml
      - ./plugins:/plugins
      - ./database:/database
    restart: unless-stopped
```

Both pass the variables in `.env` to wpbs. Without a `.env` file, remove
`--env-file` or `env_file`.
{% </collapsible> %}
