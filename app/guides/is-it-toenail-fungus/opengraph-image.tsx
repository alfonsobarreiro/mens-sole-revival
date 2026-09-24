import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Is It Toenail Fungus? The Self-Check and What Else It Could Be — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nails",
    title: "Is It Toenail Fungus?",
    meta: "7 min read",
  });
}
