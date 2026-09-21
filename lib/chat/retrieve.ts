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
  /** L2-normalized embedding vector. Voyage-3-lite is 512 dims. */
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
 * Confidence heuristic for the "I'm not sure" state.
 * Voyage-3-lite scores for on-topic queries typically land 0.55–0.85 cosine.
 * Below 0.50 is a strong "we don't cover this" signal.
 * Between 0.50 and 0.60 is borderline — show the answer but flag uncertainty.
 */
export function classifyRetrievalConfidence(hits: RetrievalHit[]): "high" | "medium" | "low" {
  if (hits.length === 0) return "low";
  const top = hits[0].score;
  if (top >= 0.6) return "high";
  if (top >= 0.5) return "medium";
  return "low";
}

/**
 * Format retrieved chunks as a system-prompt-injectable context block.
 * Sent to Claude alongside the user's question. Each chunk is prefixed with
 * a source header so the model can cite by slug + section in the reply.
 */
export function formatContext(hits: RetrievalHit[]): string {
  if (hits.length === 0) return "No relevant articles found.";

  return hits
    .map((hit, i) => {
      const { chunk } = hit;
      const source =
        chunk.type === "routine"
          ? `/routines/${chunk.slug}`
          : `/guides/${chunk.slug}`;
      const section = chunk.section ? ` — Section: ${chunk.section}` : "";
      return [
        `<source index="${i + 1}" url="${source}" title="${chunk.title}"${section}>`,
        chunk.text,
        `</source>`,
      ].join("\n");
    })
    .join("\n\n");
}
