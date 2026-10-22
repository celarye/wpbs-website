+++
title = "Instances"
description = "How wpbs runs a plugin."
weight = 3
+++

wpbs does not keep plugins running. When it calls a plugin, it creates a fresh
instance of the component, and drops the instance when the call returns.

This has two consequences:

- Memory does not carry over between calls. Anything a later call needs goes in
  storage, the WASI key-value API provided by core.
- Calls can run at the same time, each in its own instance. Values several calls
  update need the atomic storage operations.

Each entry in a project's configuration has its own storage, so the same plugin
added twice keeps two separate sets of data.
