# Original source recovery

Recovery completed on 2026-07-27 from the preserved local directory
`C:\Users\Praca\OneDrive\Work\Blog`.

## Repository findings

- The directory contains a self-contained Git repository and Markdown only:
  two published posts and three current drafts.
- Git reports one local branch (`master`), no remotes, and no tags.
- The seven-commit history runs from `f9f9438` (2016-02-28) to `6bd0a5a`
  (2016-05-10). `git fsck --full` reports no errors.
- The recovered working tree has one uncommitted author edit in
  `2016-05-10-commands-and-aspects.markdown`: “benefits to code organization”
  became “benefits to the code organization”.
- No Jekyll configuration, layouts, includes, CSS, images, `Gemfile`, or other
  assets are present in this recovered repository.

The preserved source directory and its hidden `.git` metadata were inspected
in place and were not added to this repository.

## Content comparison and import

The two prepared Astro articles were faithful HTML-based reconstructions. The
recovered source primarily differs in authorial Markdown conventions:

- Setext headings rather than ATX headings in “Commands and Aspects”.
- Straight quotes and explicit Markdown links rather than typography decoded
  from generated HTML.
- Spaced code-fence language markers such as ```` ``` csharp ````.
- The local uncommitted wording correction described above.

The recovered Markdown bodies now replace the reconstructed bodies. Astro
frontmatter, descriptions, and stable public routes remain in place. In
particular, “Commands and Aspects” keeps its published compatibility route and
date at `/2016/05/09/commands-and-aspects/`, even though the recovered source
file and frontmatter use 2016-05-10.

The following unpublished files were imported with `draft: true`, so they do
not appear in generated pages, the home page, RSS, or the sitemap:

- `create-your-own-notebook.md`
- `events-bus-wip.md`
- `notes.md`

The historical Git history also contains earlier working drafts that became
the two published posts; those were not duplicated as current drafts.

## Deliberately retained

- Astro content schema, layouts, styling, routes, and validation.
- The tracker-free historical-discussion marker pending verbatim Disqus
  recovery.
- The production safety boundary: this work does not alter Pages, DNS, the
  default branch, or live `gh-pages` content.
