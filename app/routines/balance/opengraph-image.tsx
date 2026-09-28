import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Balance Exercises for Men Over 60 | Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Balance",
    title: "The 10-Minute Balance Routine",
    meta: "10 minutes · 3+ days a week",
  });
}
