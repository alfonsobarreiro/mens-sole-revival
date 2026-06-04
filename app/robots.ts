import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/actions"],
    },
    sitemap: "https://www.menssolerevival.com/sitemap.xml",
  };
}
