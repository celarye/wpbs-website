+++
title = "Packages"
description = "The WIT packages that make up the plugin API."
weight = 2
+++

The plugin API is a set of WIT packages, kept in the
[wit repository](https://github.com/wpbs-rs/wit):

| Package | Required | Provides |
| --- | --- | --- |
| `wpbs:core` | Yes | Starting and stopping, logging, and storage |
| `wpbs-services:scheduler` | No | Jobs on cron schedules |
| `wpbs-services:discord` | No | Discord requests, events, interactions, and voice |

Each package describes both sides of a plugin: the functions it can call, and
the callbacks it implements. In WIT, this pair is called a world.

Every plugin uses core and adds the service packages it needs. For each package,
the plugin generates bindings with
[`wit-bindgen`](https://github.com/bytecodealliance/wit-bindgen#supported-guest-languages),
which supports many languages. It then implements the package's callbacks. wpbs
only calls the services a plugin implements.

Types the packages have in common, such as the `HostError` returned by failed
calls, come from a fourth package, `wpbs:shared`.
