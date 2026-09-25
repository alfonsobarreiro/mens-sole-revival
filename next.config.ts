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
    // Analytics, Unsplash); it ran report-only on production
    // first and the console showed nothing else. 'unsafe-inline' for scripts
    // is required by the inline Clarity snippet and Next's hydration scripts;
    // nonces would allow dropping it.
    const dev = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    // Preview deployments carry the Vercel toolbar (comments, flags), which
    // loads from vercel.live and talks over Pusher. Production never does.
    const preview = process.env.VERCEL_ENV === "preview";
    const live = preview ? " https://vercel.live" : "";
    const policy = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${dev} https://www.googletagmanager.com https://*.clarity.ms https://va.vercel-scripts.com${live}`,
      `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com https://va.vercel-scripts.com${live}${preview ? " wss://*.pusher.com" : ""}`,
      `img-src 'self' data: blob: https://images.unsplash.com https://*.google-analytics.com https://www.googletagmanager.com https://c.bing.com https://*.clarity.ms${live}${preview ? " https://vercel.com" : ""}`,
      `style-src 'self' 'unsafe-inline'${live}`,
      `font-src 'self'${live}${preview ? " https://assets.vercel.com" : ""}`,
      ...(preview ? ["frame-src https://vercel.live"] : []),
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    return [
      { source: "/:path*", headers: [...base, { key: "Content-Security-Policy", value: policy }] },
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
    ],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

// withBotId adds the two same-origin routes the BotID client needs (its
// challenge script and a proxy, both forwarded to Vercel). Without them the
// script 404s on every host and the chat can never send a question.
export default withBotId(withMDX(nextConfig));
