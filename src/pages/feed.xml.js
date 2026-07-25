import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { postPath, site } from "../lib/site";

export async function GET(context) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map(({ data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.publishedAt,
      link: postPath(data.slug),
    })),
  });
}
