import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { staticReviews } from "@/lib/reviews";
import { ASK_LAUNCHED } from "@/lib/chat/launch";

// Public, indexable routes. Internal/dev routes (studio, wireframes, homepage-2/3,
// case-study frames, design-critique, admin) are intentionally excluded.
// NOTE: /shop redirects to /reviews (see next.config.ts); /kits redirects too —
// sitemaps must not list redirecting URLs, so both are omitted.
//
// Per-route lastModified: stable timestamps keyed by real content change (not
// build time). SEO Bundle 1 fix — universal "now" was training Google to
// distrust the sitemap since every URL claimed to change on every build.
const ROUTE_LASTMOD: Record<string, string> = {
  // Listed only once the launch switch is on (lib/chat/launch.ts).
  ...(ASK_LAUNCHED ? { "/ask": "2026-09-21" } : {}),
  "": "2026-08-14",
  "/about": "2026-08-14",
  "/assessment": "2026-08-14",
  "/guides": "2026-08-13",
  "/guides/5-minute-routine": "2026-08-13",
  "/guides/big-toe-and-your-whole-body": "2026-08-13",
  "/guides/cracked-heels-what-actually-works": "2026-08-13",
  "/guides/toenail-fungus-what-works": "2026-09-25",
  "/guides/what-your-dress-shoes-are-doing-to-your-feet": "2026-08-13",
  "/guides/why-toe-alignment-affects-knees-and-hips": "2026-08-13",
  "/guides/why-your-feet-hurt-after-40": "2026-08-13",
  "/guides/heel-pain-first-thing-in-the-morning": "2026-09-10",
  "/guides/plantar-fasciitis-exercises-for-men-over-40": "2026-09-10",
  "/guides/arches-hurt-after-walking": "2026-09-10",
  "/guides/achilles-tendon-pain-in-men-over-40": "2026-09-10",
  "/guides/ball-of-foot-pain-in-men-over-40": "2026-09-10",
  "/guides/ingrown-toenail-what-actually-stops-the-cycle": "2026-09-18",
  "/guides/big-toe-stiffness-in-men-over-40": "2026-09-18",
  "/guides/foot-pain-from-standing-all-day": "2026-09-18",
  "/guides/knee-pain-that-starts-in-the-feet": "2026-09-18",
  "/guides/runners-over-40-foot-pain": "2026-09-18",
  "/guides/is-it-toenail-fungus": "2026-09-23",
  "/guides/toenail-fungus-treatments-compared": "2026-09-23",
  "/guides/toenail-fungus-12-month-protocol": "2026-09-23",
  "/guides/keeping-toenail-fungus-from-coming-back": "2026-09-23",
  "/guides/toenail-fungus-home-remedies-and-laser": "2026-09-23",
  "/guides/swollen-feet-and-ankles": "2026-09-25",
  "/guides/burning-feet-men-over-40": "2026-09-25",
  "/guides/black-toenail-what-it-means": "2026-09-25",
  "/guides/flat-feet-after-40": "2026-09-25",
  "/guides/how-to-measure-your-feet-for-shoes": "2026-09-25",
  "/guides/pain-on-top-of-the-foot": "2026-09-25",
  "/guides/cold-feet-and-poor-circulation": "2026-09-25",
  "/guides/hammer-toes-and-curled-toes": "2026-09-25",
  "/guides/mortons-neuroma-men-over-40": "2026-09-25",
  "/guides/heel-spurs-explained": "2026-09-25",
  "/guides/gout-in-the-big-toe-men-over-40": "2026-09-22",
  "/guides/athletes-foot-and-foot-odor-what-works": "2026-09-22",
  "/guides/calluses-and-corns-men-over-40": "2026-09-22",
  "/guides/foot-and-calf-cramps-at-night": "2026-09-22",
  "/guides/bunions-men-over-40": "2026-09-22",
  "/guides/diabetic-foot-care-men-over-40": "2026-09-22",
  "/guides/numbness-and-tingling-in-the-feet": "2026-09-22",
  "/guides/sprained-ankle-recovery-over-40": "2026-09-22",
  "/reviews": "2026-08-13",
  "/routines": "2026-09-10",
  "/routines/movement": "2026-09-10",
  "/routines/recovery": "2026-09-10",
  "/routines/strength": "2026-09-10",
  "/routines/weekly": "2026-09-10",
  "/routines/daily": "2026-09-18",
  "/routines/office-day": "2026-09-18",
  "/routines/post-workout": "2026-09-18",
  "/newsletter": "2026-08-14",
  "/foot-check": "2026-08-03",
  "/doctor-prep": "2026-08-03",
};

const routes = Object.keys(ROUTE_LASTMOD);

export default function sitemap(): MetadataRoute.Sitemap {
  const base: MetadataRoute.Sitemap = routes.map((path) => {
    const isGuideLeaf = path.startsWith("/guides/");
    const isRoutineLeaf = /^\/routines\/[^/]+$/.test(path);
    return {
      url: `${BASE}${path}`,
      lastModified: new Date(ROUTE_LASTMOD[path]),
      changeFrequency:
        isGuideLeaf || isRoutineLeaf ? ("monthly" as const) : ("weekly" as const),
      priority:
        path === ""
          ? 1
          : isGuideLeaf
          ? 0.8
          : isRoutineLeaf
          ? 0.7
          : 0.6,
    };
  });

  const reviews: MetadataRoute.Sitemap = staticReviews.map((r) => ({
    url: `${BASE}/reviews/${r.slug}`,
    lastModified: new Date(r.publishedAt ?? "2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...base, ...reviews];
}
