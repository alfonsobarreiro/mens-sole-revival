import type { MetadataRoute } from "next";

const BASE = "https://www.menssolerevival.com";

// Public, indexable routes. Internal/dev routes (studio, wireframes, homepage-2/3,
// case-study frames, design-critique) are intentionally excluded.
// Dynamic /reviews/[slug] and /shop/[slug] can be appended later by querying Sanity.
const routes = [
  "",
  "/about",
  "/assessment",
  "/guides",
  "/guides/5-minute-routine",
  "/guides/big-toe-and-your-whole-body",
  "/guides/cracked-heels-what-actually-works",
  "/guides/toenail-fungus-what-works",
  "/guides/what-your-dress-shoes-are-doing-to-your-feet",
  "/guides/why-toe-alignment-affects-knees-and-hips",
  "/reviews",
  "/routines",
  "/shop",
  "/kits",
  "/waitlist",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/guides/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/guides") ? 0.8 : 0.6,
  }));
}
