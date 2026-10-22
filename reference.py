"""Generates the API reference pages from the WIT files.

Usage: python3 reference.py path/to/wit
"""

import pathlib
import re
import sys
import textwrap

ROOT = pathlib.Path(sys.argv[1]).resolve()
OUT = pathlib.Path(__file__).resolve().parent / "content/docs/development/plugins/reference"

# Source directory, page path, title, description, and weight.
PACKAGES = [
    ("core", "core.md", "Core", "Lifecycle callbacks, logging, and shutdown requests.", 1),
    ("deps/wpbs-shared", "dependencies/shared.md", "Shared", "Types shared by all packages.", 1),
    ("deps/wasi-keyvalue", "dependencies/keyvalue.md", "Keyvalue", "Storage.", 2),
    ("services/scheduler", "services/scheduler.md", "Scheduler", "Scheduled jobs.", 1),
    ("services/discord", "services/discord/_index.md", "Discord", "Discord requests and events.", 2),
]

# Sections that group the pages above.
SECTIONS = [
    ("dependencies/_index.md", "Dependencies", "Packages the other packages build on.", 2),
    ("services/_index.md", "Services", "The optional service packages.", 3),
]

KINDS = {
    "func": "Function",
    "record": "Record",
    "variant": "Variant",
    "enum": "Enum",
    "flags": "Flags",
    "type": "Type",
}

# Parts of the vendored key-value package that wpbs does not provide.
SKIP_FILES = {"watch.wit"}
SKIP_WORLDS = {"watch-service"}

DECLARATION = re.compile(
    r"^(?:(?P<kind>record|variant|enum|flags|resource|type|interface|world)\s+(?P<name>[\w-]+)"
    r"|(?P<func>[\w-]+)\s*:\s*(?:async\s+)?(?:static\s+)?func\b"
    r"|(?P<ctor>constructor)\s*\()"
)


def parse(source):
    """Yields (parents, docs, kind, name, code) for each declaration."""
    text = re.sub(r"/\*.*?\*/", "", source, flags=re.S).expandtabs(4)
    lines = text.splitlines()
    docs = []
    stack = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        if line.startswith("///"):
            docs.append(line[3:][1:] if line[3:].startswith(" ") else line[3:])
            continue
        if not line or line.startswith("//") or line.startswith("@since") or line.startswith("use "):
            continue
        if line.startswith("package "):
            docs = []
            continue
        if line == "}":
            if stack:
                stack.pop()
            docs = []
            continue
        match = DECLARATION.match(line)
        if not match:
            docs = []
            continue
        kind = match.group("kind") or ("constructor" if match.group("ctor") else "func")
        name = match.group("name") or match.group("func") or "constructor"
        block = [lines[i - 1]]
        if kind in ("interface", "resource", "world"):
            if kind == "world":
                depth = 1
                while depth:
                    block.append(lines[i])
                    depth += lines[i].count("{") - lines[i].count("}")
                    i += 1
                code = clean(block)
                yield list(stack), docs, kind, name, code
            else:
                yield list(stack), docs, kind, name, None
                stack.append(name)
            docs = []
            continue
        if line.endswith("{"):
            depth = 1
            while depth:
                block.append(lines[i])
                depth += lines[i].count("{") - lines[i].count("}")
                i += 1
        else:
            while not block[-1].rstrip().endswith(";"):
                block.append(lines[i])
                i += 1
        yield list(stack), docs, kind, name, clean(block)
        docs = []


def clean(block):
    kept = [l for l in block if not l.strip().startswith("@since")]
    return textwrap.dedent("\n".join(kept)).strip()


MEMBER = re.compile(r"(?:import|export)\s+([\w-]+)|([\w-]+)")


def members(text):
    """Splits the doc comments of a block's members, such as fields and cases, from its code.

    Returns the code without them, and a Markdown list of the documented members.
    """
    lines = text.splitlines()
    kept = []
    items = []
    docs = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("///"):
            docs.append(stripped[3:].strip())
            continue
        if not stripped:
            following = next((l.strip() for l in lines[i + 1 :] if l.strip()), "")
            if following.startswith("///"):
                continue
        if docs and stripped:
            match = MEMBER.match(stripped)
            items.append(f"- `{match.group(1) or match.group(2)}`: {' '.join(docs)}")
            docs = []
        kept.append(line)
    return "\n".join(kept), "\n".join(items)


def code(text, parents=()):
    """A WIT code block, wrapped in its interface and resource so it is valid WIT."""
    for depth, (keyword, name) in reversed(list(enumerate(parents))):
        text = f"{keyword} {name} {{\n" + textwrap.indent(text, "    ") + "\n}"
    return f"```wit\n{text}\n```"


def render(directory):
    package = None
    sections = []
    params = []
    for path in sorted((ROOT / directory).glob("*.wit"), key=lambda p: (p.name != "world.wit", p.name)):
        if path.name in SKIP_FILES:
            continue
        source = path.read_text()
        package = package or re.search(r"package\s+([\w:-]+)", source).group(1)
        for parents, docs, kind, name, body in parse(source):
            context = [("interface", parents[0])] + [("resource", r) for r in parents[1:]] if parents else []
            prose = "\n".join(docs).strip()
            if kind == "world":
                if name in SKIP_WORLDS:
                    continue
                body, items = members(body)
                sections.append("\n\n".join(p for p in [f"## World `{name}`", prose, items, code(body)] if p))
            elif kind == "interface":
                sections.append("\n\n".join(p for p in [f"## Interface `{name}`", prose] if p))
            elif kind == "resource":
                sections.append(f"### Resource `{name}`\n\n{prose}".rstrip())
            elif kind == "record" and name.endswith("-params") and not prose:
                params.append(body)
                params_interface = parents[0]
            else:
                if len(parents) == 2:
                    heading = "####"
                    if kind == "constructor":
                        label = "Constructor"
                    elif "static func" in body:
                        label = f"Static function `{name}`"
                    else:
                        label = f"Method `{name}`"
                else:
                    heading = "###"
                    label = f"{KINDS[kind]} `{name}`"
                body, items = members(body)
                parts = [f"{heading} {label}"]
                if prose:
                    parts.append(prose)
                if items:
                    parts.append(items)
                parts.append(code(body, context))
                sections.append("\n\n".join(parts))
    if params:
        sections.append(
            "### Route parameters\n\nRecords for `route` cases that take more than one value.\n\n"
            + code("\n\n".join(params), [("interface", params_interface)])
        )
    return package, sections


def write(page, title, description, weight, intro, sections, section=False):
    path = OUT / page
    path.parent.mkdir(parents=True, exist_ok=True)
    front = f'+++\ntitle = "{title}"\ndescription = "{description}"\nweight = {weight}\n'
    if section:
        front += 'sort_by = "weight"\n'
    front += "+++\n\n"
    body = "\n\n".join([intro] + sections) if intro else "\n\n".join(sections)
    path.write_text(front + body.strip() + "\n")


def main():
    for page, title, description, weight in SECTIONS:
        write(page, title, description, weight, None, [], section=True)
    for directory, page, title, description, weight in PACKAGES:
        package, sections = render(directory)
        intro = f"Package `{package}`."
        if directory == "deps/wasi-keyvalue":
            intro += (
                " The [WASI key-value](https://github.com/WebAssembly/wasi-keyvalue) "
                "API, included in the core package for storage."
            )
        if directory == "services/discord":
            # Split the large Discord package: world and functions here,
            # resources and types on their own pages.
            index, resources, types = [], [], []
            target = index
            for s in sections:
                if s.startswith("## Interface `resources`"):
                    target = resources
                elif s.startswith("## Interface `types`"):
                    target = types
                elif s.startswith("## "):
                    target = index
                target.append(s)
            write(page, title, description, weight, intro, index, section=True)
            write("services/discord/resources.md", "Resources", "Registrations and voice channels.", 1, None, resources)
            write("services/discord/types.md", "Types", "Event kinds, requests, routes, and voice types.", 2, None, types)
        else:
            write(page, title, description, weight, intro, sections)


if __name__ == "__main__":
    main()
