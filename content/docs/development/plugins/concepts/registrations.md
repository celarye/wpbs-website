+++
title = "Registrations"
description = "Crons, subscriptions, and commands that outlive calls."
weight = 5
+++

Crons, event subscriptions, commands, and other things a plugin sets up with wpbs
are registrations. wpbs stores them, so they outlive the call that created them.

A plugin works with a registration through a handle, such as a `Cron` created
with a key. Creating or dropping the handle does nothing. Its `register` method
creates a new registration, while `update` and `deregister` change or remove an
existing one.

Any call can change registrations, but most are made in `initialization`. How
long one lasts depends on whether it exists only in wpbs, or on a remote service
as well.

## Local Registrations

Crons, one-shots, and event subscriptions exist only in wpbs, and last until
wpbs stops; a one-shot ends earlier, once it runs. A plugin registers crons and
subscriptions again each time it starts, in `initialization`.

Registering one that already exists fails with `AlreadyExists`; `update` changes
it instead.

## Remote Registrations

Application commands, message components, and modals exist on Discord as well:
users see the commands, and sent messages and modals carry the custom IDs.
Removing them when wpbs stops would break both, so they stay registered while it
is stopped. After a restart, their interactions still reach the plugin, which is
expected to keep handling them.

A plugin registers them again in `initialization` on every start, like local
ones. Registering one that already exists is safe:

- A command is updated if its guild or data changed, and left as is otherwise.
- A message component or modal is left as is, and keeps its custom ID.

wpbs deregisters the remote registrations a plugin does not register again in
a successful `initialization`, so one the plugin no longer uses is cleaned up on
the next start. If `initialization` fails, they are left as they are. To remove one as soon as wpbs stops, deregister it in `shutdown`.
