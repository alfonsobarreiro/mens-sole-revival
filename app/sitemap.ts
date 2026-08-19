import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { staticReviews } from "@/lib/reviews";

// Public, indexable routes. Internal/dev routes (studio, wireframes, homepage-2/3,
// case-study frames, design-critique, admin) are intentionally excluded.
// NOTE: /shop redirects to /reviews (see next.config.ts); /kits redirects too —
// sitemaps must not list redirecting URLs, so both are omitted.
//
// Per-route lastModified: stable timestamps keyed by real content change (not
// build time). SEO Bundle 1 fix — universal "now" was training Google to
// distrust the sitemap since every URL claimed to change on every build.
const ROUTE_LASTMOD: Record<string, string> = {
  "": "2026-08-14",
  "/about": "2026-08-14",
  "/assessment": "2026-08-14",
  "/guides": "2026-08-13",
  "/guides/5-minute-routine": "2026-08-13",
  "/guides/big-toe-and-your-whole-body": "2026-08-13",
  "/guides/cracked-heels-what-actually-works": "2026-08-13",
  "/guides/toenail-fungus-what-works": "2026-08-13",
  "/guides/what-your-dress-shoes-are-doing-to-your-feet": "2026-08-13",
  "/guides/why-toe-alignment-affects-knees-and-hips": "2026-08-13",
  "/guides/why-your-feet-hurt-after-40": "2026-08-13",
  "/reviews": "2026-08-13",
  "/routines": "2026-08-14",
  "/newsletter": "2026-08-14",
  "/foot-check": "2026-08-03",
  "/doctor-prep": "2026-08-03",
};

const routes = Object.keys(ROUTE_LASTMOD);

export default function sitemap(): MetadataRoute.Sitemap {
  const base: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(ROUTE_LASTMOD[path]),
    changeFrequency: path.startsWith("/guides/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/guides") ? 0.8 : 0.6,
  }));

  const reviews: MetadataRoute.Sitemap = staticReviews.map((r) => ({
    url: `${BASE}/reviews/${r.slug}`,
    lastModified: new Date(r.publishedAt ?? "2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...base, ...reviews];
}
