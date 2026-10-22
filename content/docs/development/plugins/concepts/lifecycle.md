+++
title = "Lifecycle"
description = "When wpbs calls a plugin."
weight = 4
+++

1. `initialization` runs each time wpbs starts and receives the plugin's
   settings. The plugin sets up its crons, subscriptions, and commands here, and
   keeps data that later calls need, such as its settings, in storage.
2. Service callbacks, such as a cron or a Discord event, run whenever they
   trigger.
3. `shutdown` runs when wpbs stops, unless it is forced to shut down.

Calls into core, such as logging and storage, are synchronous, while calls into
services are async. Calls that can fail return an error. Callbacks can return an
error too, which wpbs logs. If `initialization` returns an error, the plugin
will not be loaded.
