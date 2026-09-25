import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Toenail Fungus Treatments, Compared: Pills, Topicals, Laser, and What Cures — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nails",
    title: "Toenail Fungus Treatments, Compared",
    meta: "9 min read",
  });
}
