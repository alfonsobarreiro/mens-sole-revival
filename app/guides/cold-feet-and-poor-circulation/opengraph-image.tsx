import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Cold Feet and Poor Circulation: Nerve, Artery, or Just Cold \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Foot Health",
    title: "Cold Feet and Poor Circulation",
    meta: "7 min read",
  });
}
