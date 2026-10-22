+++
title = "Atomic"
description = "The atomics interface."
weight = 1
+++

## Interface `atomics`

A keyvalue interface that provides atomic operations.

Atomic operations are single, indivisible operations. When a fault causes an atomic operation to
fail, it will appear to the invoker of the atomic operation that the action either completed
successfully or did nothing at all.

Please note that this interface is bare functions that take a reference to a bucket. This is to
get around the current lack of a way to "extend" a resource with additional methods inside of
wit. Future version of the interface will instead extend these methods on the base `bucket`
resource.

### Variant `cas-error`

The error returned by a CAS operation

- `store-error`: A store error occurred when performing the operation
- `cas-failed`: The CAS operation failed because the value was too old. This returns a new CAS handle for easy retries. Implementors MUST return a CAS handle that has been updated to the latest version or transaction.

```wit
interface atomics {
    variant cas-error {
        store-error(error),
        cas-failed(cas),
    }
}
```

### Resource `cas`

A handle to a CAS (compare-and-swap) operation.

#### Static function `new`

Construct a new CAS operation. Implementors can map the underlying functionality
(transactions, versions, etc) as desired.

```wit
interface atomics {
    resource cas {
        new: static func(bucket: borrow<bucket>, key: string) -> result<cas, error>;
    }
}
```

#### Method `current`

Get the current value of the key (if it exists). This allows for avoiding reads if all
that is needed to ensure the atomicity of the operation

```wit
interface atomics {
    resource cas {
        current: func() -> result<option<list<u8>>, error>;
    }
}
```

### Function `increment`

Atomically increment the value associated with the key in the store by the given delta. It
returns the new value.

If the key does not exist in the store, it creates a new key-value pair with the value set
to the given delta.

If any other error occurs, it returns an `Err(error)`.

```wit
interface atomics {
    increment: func(bucket: borrow<bucket>, key: string, delta: s64) -> result<s64, error>;
}
```

### Function `swap`

Perform the swap on a CAS operation. This consumes the CAS handle and returns an error if
the CAS operation failed.

```wit
interface atomics {
    swap: func(cas: cas, value: list<u8>) -> result<_, cas-error>;
}
```
