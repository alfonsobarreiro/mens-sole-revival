import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "The 12-Month Toenail Fungus Protocol — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nails",
    title: "The 12-Month Toenail Fungus Protocol",
    meta: "8 min read",
  });
}
