+++
title = "Lifecycle"
description = "When wpbs calls a plugin."
weight = 4
+++

1. `initialization` runs each time wpbs starts and receives the plugin's
   settings. The plugin sets up its jobs, subscriptions, and commands here, and
   keeps data that later calls need, such as its settings, in storage.
2. Service callbacks, such as a job or a Discord event, run whenever they
   trigger.
3. `shutdown` runs when wpbs stops, unless it is forced to shut down.

Calls into wpbs are async, except storage calls, and return an error when they
fail. Callbacks can return an error too, which wpbs logs. If `initialization`
returns an error, the plugin will not be loaded.
