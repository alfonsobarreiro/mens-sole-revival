import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Desk Micro-Routines: Foot Exercises at Work — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Office day",
    title: "Desk Micro-Routines",
    meta: "2 minutes · every 90 minutes",
  });
}
