# Blog migration: agreed end state and execution handoff

Status: **original source recovered and imported; production cutover not authorized**

This document is the reviewable specification and Codex handoff for migrating
[`quarion/blog`](https://github.com/quarion/blog) from its frozen 2016 Jekyll
output to a maintainable Markdown-first static site.

## 1. Product intent

The blog remains deliberately small and low-maintenance:

- writing happens in Markdown;
- the site has a polished, restrained, typography-led design;
- templates and CSS are owned in the repository rather than inherited from a
  remotely versioned theme;
- publishing is push-to-deploy through GitHub Actions and GitHub Pages;
- no database, server runtime, analytics, advertising, or visitor tracking is
  required;
- the production origin is `https://blog.quarion.dev`.

The migration is not an opportunity to add a CMS, React, Tailwind, a large
theme dependency, or speculative features.

## 2. Repository and deployment end state

| Concern | End state |
|---|---|
| Default branch | `main`, containing the editable source |
| Legacy release | Existing `gh-pages` history retained and tagged or branched as `legacy-2016` |
| Generator | Plain Astro, statically rendered |
| Content | Markdown in `src/content/posts/`, validated through an Astro content collection |
| Design | Repository-owned Astro layouts and `src/styles/global.css` |
| Generated output | `dist/`, ignored by Git |
| Validation | Type/content check, static build, expected-route and legacy-URL leak checks |
| Deployment | GitHub Actions Pages artifact; only the default branch deploys |
| Production URL | `https://blog.quarion.dev`, served at `/` with no Astro `base` |
| Feed and discovery | `/feed.xml`, `/robots.txt`, generated sitemap |
| Comments | No Disqus embed; old discussion archived statically; optional Giscus only after renewed publishing justifies it |

The current implementation branch was deliberately created from the empty
historical `master` branch. It does not alter or delete the live `gh-pages`
branch.

## 3. Required public routes

The following routes are compatibility requirements:

- `/`
- `/about/`
- `/404.html`
- `/feed.xml`
- `/2016/03/06/event-based-design-introduction/`
- `/2016/05/09/commands-and-aspects/`

Canonical and social metadata must use `https://blog.quarion.dev`. The new site
must not emit the legacy origin `quarion.github.io`, a `/blog` base path, old
Google Analytics, Google+, or Disqus scripts.

Before production cutover, verify what GitHub does with both forms of each old
URL:

- `https://quarion.github.io/blog/<article-path>/`
- `http://quarion.github.io/blog/<article-path>/`

The expected result is a permanent redirect to the same article path at
`https://blog.quarion.dev`. If GitHub does not preserve the path, add a
dedicated redirect strategy before switching the domain.

## 4. Content provenance and recovery

### Current reconstruction sources

The sandbox reconstructs the two published articles from the generated HTML in
commit
[`9f82df1`](https://github.com/quarion/blog/commit/9f82df1e1a85aeb6141fc9f5eb0253a85bdc5a8a).
The legacy RSS feed is a secondary cross-check.

Relevant paths on `gh-pages`:

- `2016/03/06/event-based-design-introduction/index.html`
- `2016/05/09/commands-and-aspects/index.html`
- `about/index.html`
- `feed.xml`
- `images/me.jpeg`

The converted Markdown preserves the published wording and corrects the
generated HTML's double-escaping of C# generic angle brackets. It should be
treated as a reliable fallback, not assumed to be the original authoring source.

### Recovered original source

The original Markdown repository was recovered and compared with the prepared
Astro content on 2026-07-27. The original post bodies and three useful drafts
were imported while retaining the prepared schema and compatibility routes.
See [`original-source-recovery.md`](original-source-recovery.md) for the
repository history, working-tree state, and content comparison.

For any future recovery from another backup, search the PC and backups for:

- `_posts`
- `_config.yml`
- `pixyll`
- `jekyll`
- `Commands and Aspects`
- `Event based design`
- `Gemfile`

If another candidate directory is found, preserve the whole directory, including
hidden files and any `.git` directory. Do not run a legacy build or dependency
upgrade first.

Inspect and report:

1. configured Git remotes and all branches/tags;
2. original Markdown and frontmatter;
3. drafts or unpublished posts;
4. images and other referenced assets;
5. custom layouts, includes, CSS, and configuration;
6. differences between source and the currently published HTML.

Then merge original source into this prepared structure:

- prefer original Markdown wording and formatting;
- retain the new schema and stable public slugs;
- bring over unpublished drafts with `draft: true`;
- bring over only assets that content actually uses;
- do not bring back the Ruby/Docker Machine build or third-party scripts.

### Historical comments

The old Disqus forum shortname is `quarion`; the stable identifier is
`/2016/05/09/commands-and-aspects`. The public archive previously showed three
comments on that post and none on the other post.

The sandbox intentionally contains a visible import marker instead of invented
quotes. During recovery:

1. export or retrieve the three comments with author, timestamp, parent/reply
   relationship, and text;
2. verify them against the public thread or Disqus export;
3. store the verified discussion as repository-owned content;
4. render it as a compact “Historical discussion from 2016” section;
5. remove the temporary import marker.

Do not load Disqus JavaScript. Giscus remains disabled unless a later decision
enables it.

## 5. Prepared implementation

The local sandbox branch `agent/astro-blog-migration` contains:

- Astro configuration rooted at `https://blog.quarion.dev`;
- a typed `posts` content collection;
- reconstructed Markdown for both articles;
- stable date-based route generation;
- home, About, 404, RSS, robots, and sitemap output;
- canonical, Open Graph, and Twitter metadata;
- accessible navigation, document language, focus states, and skip link;
- a responsive, Pixyll-like but fully owned visual system;
- no client-side JavaScript;
- a Pages workflow that validates pull requests but deploys only `main`;
- a build verifier that checks required routes and rejects leaked legacy URLs
  and scripts.

This is intentionally a complete runnable baseline rather than only a scaffold.
Original content can replace the reconstructed Markdown without changing the
site architecture.

## 6. Validation and acceptance criteria

Run:

```sh
npm ci
npm test
```

Acceptance requires:

- dependency installation from the committed lockfile succeeds on Node
  `.nvmrc`;
- Astro content/type checking passes;
- the static build succeeds;
- all routes in section 3 exist;
- generated pages use the production custom-domain origin;
- no generated HTML contains `quarion.github.io`, `/blog/`, Disqus, legacy
  analytics, or Google Tag Manager;
- both articles retain all published prose, lists, links, and C# examples;
- generic C# syntax renders as `<T>`, not escaped source text;
- layout is checked at narrow phone and desktop widths;
- keyboard navigation and visible focus are usable;
- RSS and sitemap resolve to production URLs;
- a pull request build passes before any production setting changes.

## 7. GitHub handoff and safe cutover

### Phase A — publish for review

1. Reproduce or reuse this local branch from the empty `master` branch.
2. Run `npm ci && npm test`.
3. Commit the prepared source as `Migrate blog source to Astro`.
4. Push `agent/astro-blog-migration`.
5. Open a **draft** pull request targeting `master`.
6. Link the migration issue and this specification.
7. Do not merge until the original-source comparison is complete, or the owner
   explicitly accepts the reconstructed Markdown as final.

Merging into `master` is non-deploying because the workflow deploy trigger is
`main`. This creates an additional safety boundary during review.

### Phase B — preserve and activate source

1. Tag the current production commit `9f82df1e1a85aeb6141fc9f5eb0253a85bdc5a8a`
   as `legacy-2016` (or create an equivalent protected branch).
2. Merge the reviewed migration.
3. Rename/promote the source branch to `main` and make it the default branch.
4. In repository **Settings → Pages**, select **GitHub Actions** as the source.
5. Run the workflow manually and inspect its artifact before domain cutover.

### Phase C — custom domain

1. In GitHub Pages settings, set the custom domain to `blog.quarion.dev`.
2. At the DNS provider create:

   | Type | Name | Target |
   |---|---|---|
   | `CNAME` | `blog` | `quarion.github.io` |

3. Wait for GitHub's DNS check and certificate provisioning.
4. Enable **Enforce HTTPS**.
5. Verify canonical URLs, assets, RSS, sitemap, 404 behavior, and every legacy
   redirect listed in section 3.

Do not add a repository `CNAME` file as a substitute for GitHub Pages settings;
the domain must be configured in Pages.

## 8. Explicitly deferred

- final wording/design review;
- discovery and comparison of the old local source;
- verbatim import of the three historical comments;
- production branch/default-branch changes;
- GitHub Pages source changes;
- DNS and custom-domain changes;
- Giscus;
- analytics;
- editing the 2016 prose beyond unambiguous encoding repairs.
