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

Pull requests build and validate the site. A push to `main`, or a manual
workflow run on `main`, publishes the generated `dist/` artifact to GitHub
Pages. Generated files are never committed.

This is a public source repository. Commit published articles here; keep
working drafts in private storage until they are ready to publish.

The production origin is `https://blog.quarion.dev`.
