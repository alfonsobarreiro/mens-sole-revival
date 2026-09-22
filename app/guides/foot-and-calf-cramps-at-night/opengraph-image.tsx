import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Foot and Calf Cramps at Night: Why They Happen After 40 and What Stops Them — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Pain",
    title: "Foot and Calf Cramps at Night",
    meta: "7 min read",
  });
}
