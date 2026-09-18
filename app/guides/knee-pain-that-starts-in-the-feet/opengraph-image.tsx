import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Knee Pain That Starts in the Feet: The Pronation Chain — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Kinetic Chain",
    title: "Knee Pain That Starts in the Feet",
    meta: "7 min read",
  });
}
