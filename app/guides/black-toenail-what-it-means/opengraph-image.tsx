import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Black Toenail: Bruise, Fungus, or the One That Needs a Dermatologist \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Nails",
    title: "Black Toenail",
    meta: "7 min read",
  });
}
