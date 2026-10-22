+++
title = "Introduction"
sort_by = "weight"
+++

wpbs connects WebAssembly plugins to event-driven services, such as Discord or a
scheduler. Plugins, published by others or written by yourself, only implement
their own functionality, while wpbs provides the services.

Like [Spin](https://spinframework.dev), wpbs is a WebAssembly application
platform, but it focuses on high-quality, efficient integrations with the
services plugins use, built to be easy to develop on.

## Sandboxed

Each plugin runs in a WebAssembly sandbox, with access to nothing but its own
data and the enabled services. A plugin that crashes does not take wpbs or other
plugins down with it, and
[permissions](@/docs/usage/configuration/permissions.md) can limit what each
plugin may do further.

## Lightweight

wpbs is one small native binary that runs every plugin of a project. It only
creates an instance of a plugin to handle an event, so plugins that are waiting
use almost no resources. wpbs manages the services itself, so all plugins share
them instead of each running their own.

## Roadmap

- **0.1.0**: Targets a single host, with a Docker Compose-like experience.
- **0.2.0**: Will expand to cloud deployments by splitting wpbs into
  microservices, managed through several frontends.

## Where to Start

- [Usage](@/docs/usage/_index.md): Install wpbs and configure a project.
- [Development](@/docs/development/_index.md): Develop wpbs and its plugins.
