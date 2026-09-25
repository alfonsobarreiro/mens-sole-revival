import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Home Remedies and Laser for Toenail Fungus: What the Evidence Says — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nails",
    title: "Home Remedies and Laser for Toenail Fungus",
    meta: "7 min read",
  });
}
