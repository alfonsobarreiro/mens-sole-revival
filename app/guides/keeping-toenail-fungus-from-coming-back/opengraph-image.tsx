import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Keeping Toenail Fungus From Coming Back — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nails",
    title: "Keeping Toenail Fungus From Coming Back",
    meta: "7 min read",
  });
}
