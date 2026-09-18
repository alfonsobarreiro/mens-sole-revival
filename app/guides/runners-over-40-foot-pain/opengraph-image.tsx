import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Runners Over 40: Foot Pain That Wasn't There at 30 — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Pain",
    title: "Runners Over 40: Foot Pain",
    meta: "8 min read",
  });
}
