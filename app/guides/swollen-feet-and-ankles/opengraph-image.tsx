import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Swollen Feet and Ankles: Gravity, Medication, or a Same-Day Call \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Foot Health",
    title: "Swollen Feet and Ankles",
    meta: "7 min read",
  });
}
