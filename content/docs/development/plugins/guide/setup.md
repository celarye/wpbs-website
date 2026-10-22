+++
title = "Project Setup"
description = "Set up a Cargo workspace for plugins."
weight = 1
+++

Rust plugins are best developed in a Cargo workspace, which can hold any number
of them. Create one as a Git repository:

```sh
mkdir my-plugins
cd my-plugins
git init
```

and keep Cargo's build output out of it:

```txt,name=.gitignore
/target
```

## Toolchain

Plugins need Rust 1.100.0 or later, currently in beta, with the `wasm32-wasip3`
target. Pin both in `rust-toolchain.toml`, and rustup installs them on first
use:

```toml,name=rust-toolchain.toml
[toolchain]
channel = "beta"
targets = ["wasm32-wasip3"]
```

Make `wasm32-wasip3` the default target, so that `cargo build` produces
components:

```toml,name=.cargo/config.toml
[build]
target = "wasm32-wasip3"
```

## Workspace

The workspace's `Cargo.toml` starts without members.
[`wit-bindgen`](https://docs.rs/wit-bindgen), which generates Rust bindings for
the plugin API, is shared by all plugins:

```toml,name=Cargo.toml
[workspace]
resolver = "3"
members = []

[workspace.dependencies]
wit-bindgen = "0.63"

[profile.release]
lto = true
strip = true
```

The release profile keeps the built plugins small.

## Plugin API

The plugin API is defined in the
[wit repository](https://github.com/wpbs-rs/wit). Add it as a submodule:

```sh
git submodule add https://github.com/wpbs-rs/wit wit
```

Its packages have dependencies that are generated with
[wkg](https://github.com/bytecodealliance/wasm-pkg-tools). Install it, then
generate them with the submodule's script:

{% <tabs> %}
{% <tab title="macOS/Linux"> %}
```sh
./wit/gen-deps.sh
```
{% </tab> %}
{% <tab title="Windows"> %}
```powershell
.\wit\gen-deps.ps1
```
{% </tab> %}
{% </tabs> %}

Run it again after the definitions in `wit/deps` change, such as when updating
the submodule.
