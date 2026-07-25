export const site = {
  title: "Filip Gibki",
  description: "Filip's notebook on software design and engineering.",
  author: "Filip Gibki",
  language: "en",
  social: {
    github: "https://github.com/quarion",
    linkedin: "https://www.linkedin.com/in/filipgibki",
  },
} as const;

export function postPath(slug: string): string {
  return `/${slug.replace(/^\/|\/$/g, "")}/`;
}
