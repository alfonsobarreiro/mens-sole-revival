/**
 * MDX → text chunker for the MSR chatbot's retrieval pipeline.
 *
 * Reads a full MDX article body, strips MDX/JSX artifacts, and splits it
 * into ~500-token windows with ~50-token overlap. Preserves section headings
 * as context in each chunk so retrieved snippets carry their local frame.
 *
 * Token estimation uses a coarse 1-token ≈ 4-chars heuristic; good enough
 * for chunk sizing because Voyage embedding model tokenizes independently.
 */

export type ChunkType = "guide" | "routine" | "page";

export type Chunk = {
  /** Source page slug, e.g. "heel-pain-first-thing-in-the-morning". */
  slug: string;
  /** Which surface the passage came from; decides its URL at answer time. */
  type: ChunkType;
  /** Human-readable article title, mirrored from guideSeo / routineSeo. */
  title: string;
  /** Zero-based chunk index within this article. */
  chunkIndex: number;
  /** Chunk text — the content sent to the embedding model AND surfaced in
   *  the RAG context passed to Claude at answer time. */
  text: string;
  /** The nearest H2 heading above this chunk (for citation deep links + UI). */
  section?: string;
};

const APPROX_CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 500;
const OVERLAP_TOKENS = 50;

/**
 * Strip MDX/JSX-ish syntax from a raw article body so the chunk text reads as
 * plain English for the embedding model. Preserves headings + inline links'
 * label text (the URL is dropped; retrieved chunks link back to the whole
 * article, not to a specific inline href).
 */
function normalizeMdx(raw: string): string {
  return raw
    // Remove front-matter if present (`--- ... ---` at top).
    .replace(/^---[\s\S]*?---\n/, "")
    // Import / export lines.
    .replace(/^\s*(import|export)\s.*$/gm, "")
    // JSX elements on their own line: <Component ... />, <Component>...</Component>.
    .replace(/<[A-Z][\w-]*(?:\s[^>]*)?\s*\/?>/g, "")
    .replace(/<\/[A-Z][\w-]*>/g, "")
    // Markdown links: [label](url) → label.
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Bold / italic markers (leave the words).
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    // Code fences — drop entirely; MSR articles don't rely on code samples.
    .replace(/```[\s\S]*?```/g, "")
    // Inline code `x` → x.
    .replace(/`([^`]+)`/g, "$1")
    // Collapse 3+ blank lines to 2.
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extract the H1 title text from a normalized body (first line starting with `# `).
 * Returns empty string if not found; caller should fall back to seo.metaTitle.
 */
export function extractTitle(normalized: string): string {
  const m = normalized.match(/^# (.+)$/m);
  return m ? m[1].trim() : "";
}

/**
 * Split a normalized body into overlapping chunks, tracking the nearest H2
 * heading above each chunk. Chunks aim for TARGET_TOKENS but respect
 * paragraph boundaries where possible.
 */
export function chunkArticle(args: {
  slug: string;
  type: ChunkType;
  title: string;
  rawMdx: string;
}): Chunk[] {
  const normalized = normalizeMdx(args.rawMdx);
  const targetChars = TARGET_TOKENS * APPROX_CHARS_PER_TOKEN;
  const overlapChars = OVERLAP_TOKENS * APPROX_CHARS_PER_TOKEN;

  // Walk paragraphs, tracking the most recent H2.
  const paragraphs = normalized.split(/\n\n+/);
  const chunks: Chunk[] = [];

  let currentSection: string | undefined;
  let buffer = "";

  const flush = () => {
    const trimmed = buffer.trim();
    if (!trimmed) return;
    chunks.push({
      slug: args.slug,
      type: args.type,
      title: args.title,
      chunkIndex: chunks.length,
      text: trimmed,
      section: currentSection,
    });
    // Seed the next buffer with the last `overlapChars` characters so retrieved
    // chunks don't cut mid-idea. Snap to a sentence boundary if possible.
    const tail = trimmed.slice(-overlapChars);
    const boundary = tail.search(/(?<=[.!?])\s+/);
    buffer = boundary > 0 ? tail.slice(boundary).trim() + "\n\n" : "";
  };

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // H2 heading? Update the current section marker but include it in the buffer
    // so the chunk's text can start with the section for context.
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) {
      currentSection = h2Match[1].trim();
    }

    // Skip pure divider lines (`---`) after we've captured them via paragraph split.
    if (/^-{3,}$/.test(trimmed)) continue;

    // Would appending this paragraph blow the target? Flush first.
    if (buffer.length + trimmed.length + 2 > targetChars && buffer.length > 0) {
      flush();
    }

    buffer += (buffer ? "\n\n" : "") + trimmed;
  }

  // Emit whatever remains.
  flush();

  return chunks;
}
