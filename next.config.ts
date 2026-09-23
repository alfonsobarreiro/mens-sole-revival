import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  typescript: {
    // Dead routes (/shop, /shop/:slug) redirect before rendering — safe to skip
    ignoreBuildErrors: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async headers() {
    // On every route. None of these can break a page: they stop the site
    // being framed (clickjacking of the composer and the email fields),
    // block content sniffing, and trim what Referer leaks.
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ];
    // Enforced. Scoped to the origins the site uses (GA, Clarity, Vercel
    // Analytics, Unsplash, Sanity CDN); it ran report-only on production
    // first and the console showed nothing else. 'unsafe-inline' for scripts
    // is required by the inline Clarity snippet and Next's hydration scripts;
    // nonces would allow dropping it.
    const dev = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const policy = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${dev} https://www.googletagmanager.com https://*.clarity.ms https://va.vercel-scripts.com`,
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com https://va.vercel-scripts.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://*.google-analytics.com https://www.googletagmanager.com https://c.bing.com https://*.clarity.ms",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    // Studio talks to many Sanity origins, so it keeps a minimal policy.
    const studioPolicy = "frame-ancestors 'none'; object-src 'none'; base-uri 'self'";
    return [
      { source: "/:path*", headers: base },
      { source: "/((?!studio).*)", headers: [{ key: "Content-Security-Policy", value: policy }] },
      { source: "/studio/:path*", headers: [{ key: "Content-Security-Policy", value: studioPolicy }] },
    ];
  },
  async redirects() {
    return [
      // The stable production alias serves the whole site too. Send it to the
      // canonical host so search engines and analytics see one hostname.
      // Preview deployments have their own hostnames and are not affected.
      {
        source: "/:path*",
        has: [{ type: "host", value: "mens-sole-revival.vercel.app" }],
        destination: "https://www.menssolerevival.com/:path*",
        permanent: true,
      },
      { source: "/shop", destination: "/reviews", permanent: true },
      { source: "/shop/:slug", destination: "/reviews", permanent: true },
      // Old editorial routes → /guides (vocabulary aligned across the site)
      { source: "/learn", destination: "/guides", permanent: true },
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
      // Waitlist reframed to the newsletter signup
      { source: "/waitlist", destination: "/newsletter", permanent: true },
    ];
  },
  // IMPORTANT: ensure MDX is treated as React components
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Sanity CDN — for kit images uploaded via Studio
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
