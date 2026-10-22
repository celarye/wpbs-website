+++
title = "Keyvalue"
description = "Storage."
weight = 2
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

## Interface `batch`

A keyvalue interface that provides batch operations.

A batch operation is an operation that operates on multiple keys at once.

Batch operations are useful for reducing network round-trip time. For example, if you want to
get the values associated with 100 keys, you can either do 100 get operations or you can do 1
batch get operation. The batch operation is faster because it only needs to make 1 network call
instead of 100.

A batch operation does not guarantee atomicity, meaning that if the batch operation fails, some
of the keys may have been modified and some may not.

This interface does has the same consistency guarantees as the `store` interface, meaning that
you should be able to "read your writes."

Please note that this interface is bare functions that take a reference to a bucket. This is to
get around the current lack of a way to "extend" a resource with additional methods inside of
wit. Future version of the interface will instead extend these methods on the base `bucket`
resource.

### Function `get-many`

Get the key-value pairs associated with the keys in the store. It returns a list of
key-value pairs, one for each key requested.

The returned list contains an entry for every key provided. If a key does not exist in the
store, its corresponding value will be `none`.

MAY show an out-of-date value if there are concurrent writes to the store.

If any other error occurs, it returns an `Err(error)`.

```wit
interface batch {
    get-many: func(bucket: borrow<bucket>, keys: list<string>) -> result<list<tuple<string, option<list<u8>>>>, error>;
}
```

### Function `set-many`

Set the values associated with the keys in the store. If the key already exists in the
store, it overwrites the value.

Note that the key-value pairs are not guaranteed to be set in the order they are provided.

If any of the keys do not exist in the store, it creates a new key-value pair.

If any other error occurs, it returns an `Err(error)`. When an error occurs, it does not
rollback the key-value pairs that were already set. Thus, this batch operation does not
guarantee atomicity, implying that some key-value pairs could be set while others might
fail.

Other concurrent operations may also be able to see the partial results.

```wit
interface batch {
    set-many: func(bucket: borrow<bucket>, key-values: list<tuple<string, list<u8>>>) -> result<_, error>;
}
```

### Function `delete-many`

Delete the key-value pairs associated with the keys in the store.

Note that the key-value pairs are not guaranteed to be deleted in the order they are
provided.

If any of the keys do not exist in the store, it skips the key.

If any other error occurs, it returns an `Err(error)`. When an error occurs, it does not
rollback the key-value pairs that were already deleted. Thus, this batch operation does not
guarantee atomicity, implying that some key-value pairs could be deleted while others might
fail.

Other concurrent operations may also be able to see the partial results.

```wit
interface batch {
    delete-many: func(bucket: borrow<bucket>, keys: list<string>) -> result<_, error>;
}
```

## Interface `store`

A keyvalue interface that provides eventually consistent key-value operations.

Each of these operations acts on a single key-value pair.

The value in the key-value pair is defined as a `u8` byte array and the intention is that it is
the common denominator for all data types defined by different key-value stores to handle data,
ensuring compatibility between different key-value stores. Note: the clients will be expecting
serialization/deserialization overhead to be handled by the key-value store. The value could be
a serialized object from JSON, HTML or vendor-specific data types like AWS S3 objects.

Data consistency in a key value store refers to the guarantee that once a write operation
completes, all subsequent read operations will return the value that was written.

Any implementation of this interface must have enough consistency to guarantee "reading your
writes." In particular, this means that the client should never get a value that is older than
the one it wrote, but it MAY get a newer value if one was written around the same time. These
guarantees only apply to the same client (which will likely be provided by the host or an
external capability of some kind). In this context a "client" is referring to the caller or
guest that is consuming this interface. Once a write request is committed by a specific client,
all subsequent read requests by the same client will reflect that write or any subsequent
writes. Another client running in a different context may or may not immediately see the result
due to the replication lag. As an example of all of this, if a value at a given key is A, and
the client writes B, then immediately reads, it should get B. If something else writes C in
quick succession, then the client may get C. However, a client running in a separate context may
still see A or B

### Variant `error`

The set of errors which may be raised by functions in this package

- `no-such-store`: The host does not recognize the store identifier requested.
- `access-denied`: The requesting component does not have access to the specified store (which may or may not exist).
- `other`: Some implementation-specific error has occurred (e.g. I/O)

```wit
interface store {
    variant error {
        no-such-store,
        access-denied,
        other(string)
    }
}
```

### Record `key-response`

A response to a `list-keys` operation.

- `keys`: The list of keys returned by the query.
- `cursor`: The continuation token to use to fetch the next page of keys. If this is `null`, then there are no more keys to fetch.

```wit
interface store {
    record key-response {
        keys: list<string>,
        cursor: option<string>
    }
}
```

### Function `open`

Get the bucket with the specified identifier.

`identifier` must refer to a bucket provided by the host.

`error::no-such-store` will be raised if the `identifier` is not recognized.

```wit
interface store {
    open: func(identifier: string) -> result<bucket, error>;
}
```

### Resource `bucket`

A bucket is a collection of key-value pairs. Each key-value pair is stored as a entry in the
bucket, and the bucket itself acts as a collection of all these entries.

It is worth noting that the exact terminology for bucket in key-value stores can very
depending on the specific implementation. For example:

1. Amazon DynamoDB calls a collection of key-value pairs a table
2. Redis has hashes, sets, and sorted sets as different types of collections
3. Cassandra calls a collection of key-value pairs a column family
4. MongoDB calls a collection of key-value pairs a collection
5. Riak calls a collection of key-value pairs a bucket
6. Memcached calls a collection of key-value pairs a slab
7. Azure Cosmos DB calls a collection of key-value pairs a container

In this interface, we use the term `bucket` to refer to a collection of key-value pairs

#### Method `get`

Get the value associated with the specified `key`

The value is returned as an option. If the key-value pair exists in the
store, it returns `Ok(value)`. If the key does not exist in the
store, it returns `Ok(none)`.

If any other error occurs, it returns an `Err(error)`.

```wit
interface store {
    resource bucket {
        get: func(key: string) -> result<option<list<u8>>, error>;
    }
}
```

#### Method `set`

Set the value associated with the key in the store. If the key already
exists in the store, it overwrites the value.

If the key does not exist in the store, it creates a new key-value pair.

If any other error occurs, it returns an `Err(error)`.

```wit
interface store {
    resource bucket {
        set: func(key: string, value: list<u8>) -> result<_, error>;
    }
}
```

#### Method `delete`

Delete the key-value pair associated with the key in the store.

If the key does not exist in the store, it does nothing.

If any other error occurs, it returns an `Err(error)`.

```wit
interface store {
    resource bucket {
        delete: func(key: string) -> result<_, error>;
    }
}
```

#### Method `exists`

Check if the key exists in the store.

If the key exists in the store, it returns `Ok(true)`. If the key does
not exist in the store, it returns `Ok(false)`.

If any other error occurs, it returns an `Err(error)`.

```wit
interface store {
    resource bucket {
        exists: func(key: string) -> result<bool, error>;
    }
}
```

#### Method `list-keys`

Get all the keys in the store with an optional cursor (for use in pagination). It
returns a list of keys. Please note that for most KeyValue implementations, this is a
can be a very expensive operation and so it should be used judiciously. Implementations
can return any number of keys in a single response, but they should never attempt to
send more data than is reasonable (i.e. on a small edge device, this may only be a few
KB, while on a large machine this could be several MB). Any response should also return
a cursor that can be used to fetch the next page of keys. See the `key-response` record
for more information.

Note that the keys are not guaranteed to be returned in any particular order.

If the store is empty, it returns an empty list.

MAY show an out-of-date list of keys if there are concurrent writes to the store.

If any error occurs, it returns an `Err(error)`.

```wit
interface store {
    resource bucket {
        list-keys: func(cursor: option<string>) -> result<key-response, error>;
    }
}
```
