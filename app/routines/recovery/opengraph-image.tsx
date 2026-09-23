import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "The 6-Minute Foot Recovery Routine — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Recovery",
    title: "The 6-Minute Recovery Routine",
    meta: "6 minutes · daily or as needed",
  });
}
