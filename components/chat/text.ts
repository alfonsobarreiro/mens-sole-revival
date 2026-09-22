/** The assistant's markdown as plain sentences, for screen readers and the clipboard. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*(?:[-*]|\d+[.)])\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,3}\s+/gm, "")
    .trim();
}
