import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { staticReviews } from "@/lib/reviews";

// Public, indexable routes. Internal/dev routes (studio, wireframes, homepage-2/3,
// case-study frames, design-critique) are intentionally excluded.
// NOTE: /shop is omitted on purpose — it permanently redirects to /reviews
// (see next.config.ts), and sitemaps must not list redirecting URLs.
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
  "/guides/why-your-feet-hurt-after-40",
  "/reviews",
  ...staticReviews.map((r) => `/reviews/${r.slug}`),
  "/routines",
  "/kits",
  "/newsletter",
  "/foot-check",
  "/doctor-prep",
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
