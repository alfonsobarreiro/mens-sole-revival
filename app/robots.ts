import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Studio + internal draft/dev surfaces kept out of search. (/actions
      // dropped — server actions aren't routable URLs, so disallowing it was
      // a no-op.)
      disallow: [
        "/studio",
        "/design-critique",
        "/case-study",
        "/homepage-2",
        "/homepage-3",
        "/homepage-wireframe",
        "/assessment-wireframe",
        "/admin",
        "/progress",
        "/imagery-treatments",
        "/kits",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
