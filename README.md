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

## Analytics

Production deployments use Cloudflare Web Analytics for aggregate page-view,
popular-page, and referrer statistics. Cloudflare documents that Web Analytics
does not use cookies, local storage, or visitor fingerprinting.

The Web Analytics site is owned by the Cloudflare account that manages
`quarion.dev`. Its public beacon token is stored as the
`CLOUDFLARE_WEB_ANALYTICS_TOKEN` GitHub Actions repository variable. The
deployment workflow exposes it only to non-pull-request builds of `main`, so
local development, local tests, and pull-request builds contain no analytics
beacon.

To disable analytics, remove that repository variable. The build verifier
allows only Cloudflare's exact beacon URL when the token is configured and
continues to reject the retired Universal Analytics, Google Tag Manager, and
Disqus integrations.
