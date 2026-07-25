# Filip Gibki's notebook

A small static blog: Markdown content, owned Astro templates and CSS, and a
reproducible GitHub Pages build.

## Local development

Requires Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Run the same validation used in CI:

```sh
npm test
```

## Publishing

Pull requests build and validate the site. A push to the default branch also
publishes the generated `dist/` artifact to GitHub Pages. Generated files are
never committed.

The production origin is `https://blog.quarion.dev`. See
[`docs/migration-spec.md`](docs/migration-spec.md) for migration decisions,
content-recovery instructions, acceptance criteria, and the manual cutover.
