+++
title = "Running the Plugin"
description = "Run the plugin in a local wpbs project."
weight = 3
+++

Set up a wpbs project next to the workspace, as described in
[Quick Start](@/docs/usage/quick-start.md):

```txt
my-plugins/
my-project/
└── config.yaml
```

wpbs loads your own plugins from `plugins/binaries/local/<name>/<version>/`.
Copy the built plugin there, from `my-project`:

```sh
mkdir -p plugins/binaries/local/greeter/0.1.0
cp ../my-plugins/target/wasm32-wasip3/release/greeter.wasm \
    plugins/binaries/local/greeter/0.1.0/plugin.wasm
```

Add it to `config.yaml`, under the `local` namespace:

```yaml,name=config.yaml
name: my-project

plugins:
  greeter:
    plugin: local/greeter:0.1.0
```

Start wpbs from `my-project`:

```sh
wpbs
```

The log shows `Hello from greeter!`, and `Goodbye from greeter!` when you stop
it.

After each change to the plugin, rebuild it, copy it again, and restart wpbs.
When running wpbs through Docker instead, restart its container.
