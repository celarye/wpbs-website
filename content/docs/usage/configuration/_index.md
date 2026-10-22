+++
title = "Configuration"
description = "The project's config.yaml."
weight = 3
sort_by = "weight"
+++

`config.yaml` describes a project: its name, the services it enables, and the
plugins it runs.

```yaml,name=config.yaml
name: my-project

services:
  scheduler:
    enabled: true

plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
```

All three top-level keys are optional:

- `name` names the project.

  Without it, wpbs generates one on the first start and keeps using it. Plugin
  data is kept per project, so a renamed project starts without it.

- `services` enables the services plugins can use.
- `plugins` lists the plugins to run.

## Interpolation

Values can refer to environment variables as `${NAME}`, such as those in `.env`.
This keeps secrets out of `config.yaml`:

```sh,name=.env
HELLO_WORLD_SECRET_GREETING=Hello, secret world!
```

```yaml,name=config.yaml
plugins:
  hello-world:
    plugin: wpbs/hello-world:0.1.0
    environment:
      SECRET_GREETING: ${HELLO_WORLD_SECRET_GREETING}
```

## Further Configuration

Services, plugins, and their permissions each have a page of their own:
