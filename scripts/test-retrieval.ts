/**
 * Retrieval sanity check: embed a handful of lay-language questions in ONE
 * gateway request (free tier allows few requests per minute), then print the
 * top hits and the confidence bucket for each.
 *
 *   pnpm --allow-build=esbuild dlx tsx --env-file=.env.local scripts/test-retrieval.ts
 */

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { embedTexts } from "../lib/chat/embed";
import {
  retrieveTopK,
  classifyRetrievalConfidence,
  type EmbeddedChunk,
} from "../lib/chat/retrieve";

const index = JSON.parse(
  readFileSync(join(resolve(__dirname, ".."), "lib/chat/embeddings.json"), "utf8"),
) as { chunks: EmbeddedChunk[] };

const QUESTIONS: { q: string; expectSlug: string | null }[] = [
  { q: "the bottom of my foot burns by dinner time", expectSlug: "ball-of-foot-pain-in-men-over-40" },
  { q: "why does my heel kill me when I get out of bed", expectSlug: "heel-pain-first-thing-in-the-morning" },
  { q: "back of my ankle hurts when I run uphill", expectSlug: "achilles-tendon-pain-in-men-over-40" },
  { q: "my toenail keeps growing into the skin", expectSlug: "ingrown-toenail-what-actually-stops-the-cycle" },
  { q: "I sit at a desk all day, anything I can do for my feet at work", expectSlug: "office-day" },
  { q: "my knee hurts, could it be my feet", expectSlug: "knee-pain-that-starts-in-the-feet" },
  { q: "yellow thick toenails what works", expectSlug: "toenail-fungus-what-works" },
  { q: "what is the best pizza in Portland", expectSlug: null },
  { q: "how do I fix my car's alternator", expectSlug: null },
];

async function main() {
  const { vectors } = await embedTexts(QUESTIONS.map((x) => x.q));
  let pass = 0;

  QUESTIONS.forEach(({ q, expectSlug }, i) => {
    const hits = retrieveTopK({ queryEmbedding: vectors[i], chunks: index.chunks, k: 3 });
    const confidence = classifyRetrievalConfidence(hits);
    const topSlug = hits[0]?.chunk.slug;

    const ok = expectSlug === null ? confidence === "low" : topSlug === expectSlug;
    if (ok) pass++;

    console.log(`\n${ok ? "PASS" : "FAIL"}  "${q}"`);
    console.log(`      expected: ${expectSlug ?? "(off-topic, low confidence)"}   confidence: ${confidence}`);
    hits.forEach((h) =>
      console.log(`      ${h.score.toFixed(3)}  ${h.chunk.slug}  [${h.chunk.section ?? "intro"}]`),
    );
  });

  console.log(`\nRESULT: ${pass}/${QUESTIONS.length} pass\n`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
