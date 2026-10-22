+++
title = "Components"
description = "What a plugin is."
weight = 1
+++

A plugin is a WebAssembly component.

[WebAssembly](https://webassembly.org) is a portable binary format that many
programming languages compile to, such as Rust, Python, and JavaScript. Its code
runs in a sandbox and can only use what the program running it provides.

The [component model](https://component-model.bytecodealliance.org) packages
WebAssembly code as a component, with typed imports and exports. They are
described in
[WIT](https://component-model.bytecodealliance.org/design/wit.html), an
interface description language.

[WASI](https://wasi.dev) builds on the component model. It defines standard
interfaces for what the running program can provide, such as clocks, files, and
key-value storage.

wpbs runs plugins as components, and provides what they import.
