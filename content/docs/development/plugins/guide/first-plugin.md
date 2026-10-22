+++
title = "Your First Plugin"
description = "Create a plugin that logs when it starts and stops."
weight = 2
+++

Create the plugin's crate. `cargo new` adds it to the workspace members:

```sh
cargo new --lib greeter
```

wpbs runs plugins as WebAssembly components, which Rust builds from `cdylib`
crates. Add the crate type and the `wit-bindgen` dependency to
`greeter/Cargo.toml`:

```toml,name=greeter/Cargo.toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wit-bindgen.workspace = true
```

## Bindings

Every plugin uses the core package, which handles initialization and shutdown.
Replace the contents of `greeter/src/lib.rs` with a `bindings` module that
generates core's Rust bindings:

```rust,name=greeter/src/lib.rs
mod bindings {
    pub mod core {
        wit_bindgen::generate!({ path: "../wit/core", generate_all });
    }
}
```

`path` points to the package in the submodule. `generate_all` also generates the
packages core depends on.

The bindings need a type that implements the plugin. Add it below the module:

```rust,name=greeter/src/lib.rs
struct Plugin;
```

and export it from the core bindings:

```rust,name=greeter/src/lib.rs,hl_lines=3 7
mod bindings {
    pub mod core {
        use crate::Plugin;

        wit_bindgen::generate!({ path: "../wit/core", generate_all });

        export!(Plugin);
    }
}
```

## Callbacks

rust-analyzer now reports that `Plugin` does not implement `Guest`. `Guest` is
the trait with core's callbacks, the functions wpbs calls. Import it, along with
the logging function the plugin will use, at the top of the file:

```rust,name=greeter/src/lib.rs,hl_lines=1-4
use bindings::core::{
    exports::wpbs::core::lifecycle_handler::Guest,
    wpbs::core::logging::{LogLevel, log},
};

mod bindings {
```

Start with `initialization`, which runs when wpbs starts. Its argument holds the
plugin's settings; the guide uses them later.

```rust,name=greeter/src/lib.rs
impl Guest for Plugin {
    async fn initialization(_settings: Vec<u8>) -> Result<(), String> {
        log(LogLevel::Info, "Hello from greeter!".to_string());

        Ok(())
    }
}
```

The second callback, `shutdown`, runs when wpbs stops. Add it to the `impl`:

```rust,name=greeter/src/lib.rs,hl_lines=8-12
impl Guest for Plugin {
    async fn initialization(_settings: Vec<u8>) -> Result<(), String> {
        log(LogLevel::Info, "Hello from greeter!".to_string());

        Ok(())
    }

    async fn shutdown() -> Result<(), String> {
        log(LogLevel::Info, "Goodbye from greeter!".to_string());

        Ok(())
    }
}
```

When a callback returns an error, wpbs logs it.

## Building

```sh
cargo build --release
```

The plugin is `target/wasm32-wasip3/release/greeter.wasm`.
