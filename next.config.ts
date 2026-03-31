import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      { source: "/shop", destination: "/reviews", permanent: true },
      { source: "/shop/:slug", destination: "/reviews", permanent: true },
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
