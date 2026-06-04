/**
 * Shared OG image template for Men's Sole Revival.
 *
 * Each route's `opengraph-image.tsx` imports `renderMsrOg` and supplies
 * its specific overline / title / meta. Keeps brand styling consistent
 * across guides, reviews, hub pages, and the site root in one place.
 *
 * Brand surface:
 *   bg     #112840   brand-700 (deep navy)
 *   accent #BE7241   accent-400 (cognac overline)
 *   body   #BBCDDD   brand-200 (muted footer + URL)
 *   title  #FFFFFF
 *
 * Edge-runtime ImageResponse defaults to a sans bundled font. Custom
 * font loading (Lora) is a follow-up — ships fine without it for now.
 */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

interface MsrOgProps {
  /** Eyebrow text, e.g. "Guide · Toe Alignment". Defaults to brand. */
  overline?: string;
  /** The main headline. Required. */
  title: string;
  /** Bottom-left small line, e.g. "6 min read" or a tagline. */
  meta?: string;
}

export function renderMsrOg({ overline, title, meta }: MsrOgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#112840",
          color: "#F0F2F4",
        }}
      >
        {/* Top: overline + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#BE7241" }}>{overline ?? "Men's Sole Revival"}</span>
          <span style={{ color: "#BBCDDD" }}>menssolerevival.com</span>
        </div>

        {/* Center: headline */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "#FFFFFF",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* Bottom: meta + brand */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#BBCDDD",
            letterSpacing: "0.04em",
          }}
        >
          <span>{meta ?? "Foot care, footwear, and the daily habits."}</span>
          <span>Men's Sole Revival</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
