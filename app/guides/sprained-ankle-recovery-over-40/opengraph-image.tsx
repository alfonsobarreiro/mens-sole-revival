import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Sprained Ankle After 40: How to Recover Without Turning It Into a Weak Ankle for Life — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Pain",
    title: "Sprained Ankle After 40",
    meta: "8 min read",
  });
}
