import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small subset of markdown the assistant is allowed to write:
 * paragraphs, bullet and numbered lists, block quotes, bold, italic, links.
 *
 * Built by hand rather than with a markdown library so model output can never
 * become HTML: every node is a React element, and links only render when they
 * point at this site ("/...") or an https URL. Anything else stays plain text.
 * Half-finished markdown during streaming also stays plain text until the
 * closing characters arrive.
 */

const linkClass = "text-link underline underline-offset-4 hover:text-link-hover";

const INLINE_TOKEN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-medium">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/") && !href.startsWith("//")) {
        return (
          <Link key={key} href={href} className={linkClass}>
            {label}
          </Link>
        );
      }
      if (href.startsWith("https://")) {
        return (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {label}
          </a>
        );
      }
      return label;
    }

    return part;
  });
}

export default function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className="space-y-4 text-[1.0625rem] leading-[1.5] text-ink">
      {blocks.map((block, b) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (lines.length === 0) return null;
        const key = `b${b}`;

        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={key} className="list-disc space-y-2 pl-5">
              {lines.map((l, i) => (
                <li key={i}>{renderInline(l.replace(/^\s*[-*]\s+/, ""), `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={key} className="list-decimal space-y-2 pl-5">
              {lines.map((l, i) => (
                <li key={i}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ""), `${key}-${i}`)}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((l) => l.startsWith(">"))) {
          return (
            <blockquote key={key} className="border-l-2 border-neutral-300 pl-4 text-neutral-700">
              {renderInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), key)}
            </blockquote>
          );
        }

        const heading = lines.length === 1 && lines[0].match(/^#{1,3}\s+(.+)$/);
        if (heading) {
          return (
            <p key={key} className="font-medium">
              {renderInline(heading[1], key)}
            </p>
          );
        }

        return <p key={key}>{renderInline(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
