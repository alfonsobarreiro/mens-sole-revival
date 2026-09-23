import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  typescript: {
    // Dead routes (/shop, /shop/:slug) redirect before rendering — safe to skip
    ignoreBuildErrors: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async headers() {
    // Enforced on every route. Nothing here can break a page: it stops the
    // site being framed (clickjacking of the composer and the email fields),
    // blocks plugins and <base> tricks, and trims what Referer leaks.
    const enforced = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
    ];
    // Reported, not enforced: the full policy, scoped to the origins the site
    // uses (GA, Clarity, Unsplash, Sanity CDN). Violations show in the browser
    // console. Promote it to Content-Security-Policy once it runs clean.
    // 'unsafe-inline' for scripts is required by the inline Clarity snippet
    // and Next's hydration scripts; nonces would allow dropping it.
    const dev = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const reportOnly = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${dev} https://www.googletagmanager.com https://www.clarity.ms`,
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms",
      "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://*.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    return [
      { source: "/:path*", headers: enforced },
      // Studio talks to many Sanity origins; it keeps the enforced set only.
      { source: "/((?!studio).*)", headers: [{ key: "Content-Security-Policy-Report-Only", value: reportOnly }] },
    ];
  },
  async redirects() {
    return [
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

// withBotId adds the proxy rewrites BotID needs to protect POST /api/ask.
export default withBotId(withMDX(nextConfig));
