import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const expected = [
  "index.html",
  "about/index.html",
  "404.html",
  "feed.xml",
  "robots.txt",
  "sitemap-index.xml",
  "2016/03/06/event-based-design-introduction/index.html",
  "2016/05/09/commands-and-aspects/index.html",
];

const errors = [];
const generatedHtml = new Map();

for (const path of expected) {
  try {
    const file = join(dist.pathname, path);
    const metadata = await stat(file);
    if (!metadata.isFile() || metadata.size === 0) errors.push(`${path}: missing or empty`);
  } catch {
    errors.push(`${path}: missing`);
  }
}

for (const path of expected.filter((path) => path.endsWith(".html"))) {
  try {
    const html = await readFile(join(dist.pathname, path), "utf8");
    generatedHtml.set(path, html);
    if (!html.includes('lang="en"')) errors.push(`${path}: missing document language`);
    if (!html.includes("https://blog.quarion.dev")) errors.push(`${path}: missing production URL`);
    if (/quarion\.github\.io|\/blog\//.test(html)) errors.push(`${path}: legacy base URL leaked`);
    if (/disqus\.com\/embed|google-analytics\.com|googletagmanager\.com/i.test(html)) {
      errors.push(`${path}: third-party legacy script leaked`);
    }
  } catch {
    // Missing files are already reported above.
  }
}

const contentSentinels = {
  "2016/03/06/event-based-design-introduction/index.html": [
    "Event Aggregator",
    "SimpleEventAggregator",
    "Caliburn.Micro",
    "Coming next",
  ],
  "2016/05/09/commands-and-aspects/index.html": [
    "ICommandHandler",
    "ValidationAspect",
    "CommandsNinjectModule",
    "Meanwhile… on the command side of my architecture",
  ],
};

for (const [path, sentinels] of Object.entries(contentSentinels)) {
  const html = generatedHtml.get(path) ?? "";
  for (const sentinel of sentinels) {
    if (!html.includes(sentinel)) errors.push(`${path}: missing content sentinel "${sentinel}"`);
  }
}

async function collectHtmlPaths(directory, prefix = "") {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) paths.push(...(await collectHtmlPaths(join(directory, entry.name), relative)));
    if (entry.isFile() && extname(entry.name) === ".html") paths.push(relative);
  }
  return paths;
}

for (const path of await collectHtmlPaths(dist.pathname)) {
  const html = generatedHtml.get(path) ?? (await readFile(join(dist.pathname, path), "utf8"));
  const hrefPattern = /href="([^"]+)"/g;
  for (const [, href] of html.matchAll(hrefPattern)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;

    const pathname = href.split(/[?#]/, 1)[0];
    let target = normalize(join(dist.pathname, pathname));
    if (pathname.endsWith("/")) target = join(target, "index.html");
    if (!extname(target)) target = join(target, "index.html");

    try {
      const metadata = await stat(target);
      if (!metadata.isFile()) errors.push(`${path}: internal link is not a file: ${href}`);
    } catch {
      errors.push(`${path}: broken internal link: ${href}`);
    }
  }
}

if (errors.length) {
  console.error("Build verification failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${expected.length} generated routes and legacy-leak checks.`);
}
