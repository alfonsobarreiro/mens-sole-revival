/**
 * In-memory cosine-similarity retrieval over precomputed article-chunk
 * embeddings for the MSR chatbot.
 *
 * The embeddings JSON ships in the app bundle (see scripts/build-embeddings.ts).
 * At query time we embed the user's question with the same Voyage model, then
 * pick the top-K chunks by cosine similarity. Cheap enough at ~100 chunks
 * that we don't need a vector database.
 */

import type { Chunk } from "./chunk";

export type EmbeddedChunk = Chunk & {
  /** L2-normalized embedding vector: voyage-4-lite trimmed to 512 dims. */
  embedding: number[];
};

export type RetrievalHit = {
  chunk: EmbeddedChunk;
  score: number;
};

/** Cosine similarity assumes both vectors are L2-normalized (they are, at
 *  embed time). Reduces to a dot product. */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

/**
 * Retrieve the top-K most-similar chunks to a query embedding, optionally
 * boosting one content type (guide vs routine) if the query classifier hints
 * at a "how to" intent (which should prefer routine sub-pages).
 */
export function retrieveTopK(args: {
  queryEmbedding: number[];
  chunks: EmbeddedChunk[];
  k?: number;
  /** Optional soft boost: multiply the score of chunks with this type by 1.1. */
  preferType?: "guide" | "routine";
}): RetrievalHit[] {
  const { queryEmbedding, chunks, k = 4, preferType } = args;

  const scored: RetrievalHit[] = chunks.map((chunk) => {
    const base = cosineSimilarity(queryEmbedding, chunk.embedding);
    const boost = preferType && chunk.type === preferType ? 1.1 : 1;
    return { chunk, score: base * boost };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

/**
 * Confidence buckets that pick the page state:
 *   high    answer state
 *   medium  "I'm not sure" state (model still answers, with the closest guide)
 *   low     out-of-scope state (no model call, so off-topic questions cost nothing)
 *
 * Calibrated 2026-09-21 against voyage-4-lite at 512 dims with
 * scripts/calibrate-confidence.ts (top-hit cosine score per question):
 *   covered by a guide          0.54 to 0.70
 *   about feet, not covered     0.44 to 0.58  (gout, warts, sprains, orthotics)
 *   nothing to do with feet     0.08 to 0.38
 * Re-run the script after adding guides or changing the embedding model.
 */
export const CONFIDENCE_HIGH = 0.53;
export const CONFIDENCE_MEDIUM = 0.4;

export function classifyRetrievalConfidence(hits: RetrievalHit[]): "high" | "medium" | "low" {
  if (hits.length === 0) return "low";
  const top = hits[0].score;
  if (top >= CONFIDENCE_HIGH) return "high";
  if (top >= CONFIDENCE_MEDIUM) return "medium";
  return "low";
}

/**
 * Format retrieved chunks as the <source> blocks inside the context message.
 * Each block carries the article URL so the model can link a next step.
 */

/** Site path for a chunk's article. */
export function chunkUrl(chunk: Chunk): string {
  return chunk.type === "routine" ? `/routines/${chunk.slug}` : `/guides/${chunk.slug}`;
}

/**
 * The guides shown under an answer: distinct articles among the hits that
 * scored close to the best one. Decided here, not by the model, so the list
 * cannot be steered by anything a visitor types.
 */
export function sourcesFromHits(
  hits: RetrievalHit[],
  opts: { window?: number; max?: number } = {},
): { title: string; url: string }[] {
  const { window = 0.08, max = 3 } = opts;
  if (hits.length === 0) return [];
  const floor = Math.max(CONFIDENCE_MEDIUM, hits[0].score - window);
  const seen = new Set<string>();
  const out: { title: string; url: string }[] = [];
  for (const hit of hits) {
    if (hit.score < floor) continue;
    const url = chunkUrl(hit.chunk);
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ title: hit.chunk.title, url });
    if (out.length >= max) break;
  }
  return out;
}

export function formatContext(hits: RetrievalHit[]): string {
  if (hits.length === 0) return "No relevant articles found.";

  return hits
    .map((hit, i) => {
      const { chunk } = hit;
      const source =
        chunk.type === "routine"
          ? `/routines/${chunk.slug}`
          : `/guides/${chunk.slug}`;
      const attr = (value: string) => value.replace(/"/g, "'");
      const section = chunk.section ? ` section="${attr(chunk.section)}"` : "";
      return [
        `<source index="${i + 1}" url="${source}" title="${attr(chunk.title)}"${section}>`,
        chunk.text,
        `</source>`,
      ].join("\n");
    })
    .join("\n\n");
}
