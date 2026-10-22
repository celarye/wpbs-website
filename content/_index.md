+++
description = "Connect lightweight, sandboxed WebAssembly plugins to event-driven services, such as Discord or a scheduler."

[extra]
features = [
    { icon = "file", title = "Simple Configuration", text = "Describe the services and plugins of your project in a simple YAML file.", link = "@/docs/usage/configuration/_index.md" },
    { icon = "zap", title = "Service Integrations", text = "High-quality, efficient integrations with services such as Discord.", link = "@/docs/usage/configuration/services.md" },
    { icon = "package", title = "Public Plugins", text = "Assemble your project from ready-made plugins in public plugin registries.", link = "@/docs/usage/configuration/plugins.md#sources" },
    { icon = "code", title = "Your Own Plugins", text = "Add plugins of your own next to public ones. They only implement their own functionality.", link = "@/docs/development/plugins/_index.md" },
    { icon = "shield", title = "Sandboxed", text = "Plugins run as WebAssembly components and can only reach what wpbs provides them.", link = "@/docs/_index.md#sandboxed" },
    { icon = "leaf", title = "Lightweight", text = "A single binary runs every plugin, and plugins only run while they handle something.", link = "@/docs/_index.md#lightweight" },
]
+++
