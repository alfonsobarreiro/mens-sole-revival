import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "The Nightly 5-Minute Foot-Care Checklist — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Daily",
    title: "The Nightly 5-Minute Checklist",
    meta: "5 minutes · every night",
  });
}
