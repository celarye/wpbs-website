+++
title = "Shared"
description = "Shared payload and error types."
weight = 1
+++

Package `wpbs:shared`.

## Interface `shared-types`

Provides shared payload and error types.

### Type `json`

A JSON value encoded as UTF-8 bytes.

```wit
interface shared-types {
    type json = list<u8>;
}
```

### Variant `host-error`

A failure reported by a host operation.

```wit
interface shared-types {
    variant host-error {
        already-exists,
        invalid-argument,
        not-found,
        permission-denied,
        unavailable,
        other(string),
    }
}
```

### Type `plugin-error`

A failure reported by a plugin callback.

```wit
interface shared-types {
    type plugin-error = string;
}
```
