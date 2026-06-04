import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "A 5-Minute Daily Foot-Care Routine You Can Stick To — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Daily Routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Stick To",
    meta: "4 min read",
  });
}
