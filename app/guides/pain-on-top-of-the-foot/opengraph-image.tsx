import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Pain on Top of the Foot: Laces, Tendon, Stress Fracture, or Arthritis \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Pain",
    title: "Pain on Top of the Foot",
    meta: "7 min read",
  });
}
