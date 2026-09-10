import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "The Plantar Stretch Sequence — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Movement",
    title: "The Plantar Stretch Sequence",
    meta: "3 minutes · every morning",
  });
}
