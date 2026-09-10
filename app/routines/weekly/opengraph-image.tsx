import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "The Sunday Foot Reset — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Weekly",
    title: "The Sunday Foot Reset",
    meta: "20 minutes · once a week",
  });
}
