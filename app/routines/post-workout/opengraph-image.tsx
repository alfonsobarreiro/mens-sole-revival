import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "The 8-Minute Post-Workout Recovery Routine — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Routine · Post-workout",
    title: "The 8-Minute Recovery Routine",
    meta: "8 minutes · after training",
  });
}
