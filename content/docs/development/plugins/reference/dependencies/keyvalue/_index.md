+++
title = "Keyvalue"
description = "Key-value stores, with atomic and batch operations."
weight = 2
sort_by = "weight"

[extra]
children_heading = "Interfaces"
+++

Package `wasi:keyvalue`. The [WASI key-value](https://github.com/WebAssembly/wasi-keyvalue) API, included in the core package for storage.

## World `imports`

The `wasi:keyvalue/imports` world provides common APIs for interacting with key-value stores.
Components targeting this world will be able to do:

1. CRUD (create, read, update, delete) operations on key-value stores.
2. Atomic `increment` and CAS (compare-and-swap) operations.
3. Batch operations that can reduce the number of round trips to the network.

- `store`: The `store` capability allows the component to perform eventually consistent operations on the key-value store.
- `atomics`: The `atomic` capability allows the component to perform atomic / `increment` and CAS (compare-and-swap) operations.
- `batch`: The `batch` capability allows the component to perform eventually consistent batch operations that can reduce the number of round trips to the network.

```wit
world imports {
    import store;
    import atomics;
    import batch;
}
```
