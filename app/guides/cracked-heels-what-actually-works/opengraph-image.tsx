import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Cracked Heels: The Fix That Isn't a Pumice Stone — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Dry Skin",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    meta: "5 min read",
  });
}
