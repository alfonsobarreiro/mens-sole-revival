import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Foot Strengthening Protocol for Men Over 40 — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Strength",
    title: "The 5-Minute Strength Protocol",
    meta: "5 minutes · 3x per week",
  });
}
