# wpbs-website

The [wpbs](https://github.com/wpbs-rs) website.

## Development

The website is built with [Zola](https://www.getzola.org) 0.23.

```sh
zola serve
```

The plugin API reference is generated from the
[WIT files](https://github.com/wpbs-rs/wit). Regenerate it after they change:

```sh
python3 reference.py path/to/wit
```

## License

The content is licensed under [CC BY-SA 4.0](LICENSE). The WIT grammar in
`syntaxes` is licensed under the Apache License 2.0.
