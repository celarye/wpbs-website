+++
title = "Packages"
description = "The WIT packages that make up the plugin API."
weight = 2
+++

The plugin API is a set of WIT packages, kept in the
[wit repository](https://github.com/wpbs-rs/wit):

| Package | Required | Provides |
| --- | --- | --- |
| `wpbs:core` | Yes | Storage, logging, and starting and stopping |
| `wpbs-services:scheduler` | No | Crons and one-shots |
| `wpbs-services:discord` | No | Discord events, requests, interactions, and voice channels |

Each package is made up of worlds. A world describes both sides of a feature:
the functions a plugin can call, and the callbacks it implements. Core has a
single world, while a service has one for each of its features, such as the
scheduler's `cron` and `one-shot`.

Every plugin uses core and adds the service worlds it needs. For each world, the
plugin generates bindings with
[`wit-bindgen`](https://github.com/bytecodealliance/wit-bindgen#supported-guest-languages),
which supports many languages. It then implements the world's callbacks. wpbs
only calls the callbacks a plugin implements.

Types the packages have in common, such as the `HostError` returned by failed
calls, come from a fourth package, `wpbs:shared`.
