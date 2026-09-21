/**
 * Smoke test for lib/chat/chunk.ts against the real MSR MDX corpus.
 * Runs the chunker on every guide + routine article and prints a summary
 * so we can validate chunk sizing + coverage before spending on embeddings.
 *
 *   npx tsx scripts/test-chunker.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chunkArticle, type Chunk } from "../lib/chat/chunk";

const REPO_ROOT = resolve(__dirname, "..");

function readArticles(baseDir: string, type: "guide" | "routine") {
  const results: { slug: string; raw: string; type: "guide" | "routine" }[] = [];
  for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const mdxPath = join(baseDir, entry.name, "article.mdx");
    try {
      statSync(mdxPath);
    } catch {
      continue;
    }
    results.push({ slug: entry.name, raw: readFileSync(mdxPath, "utf8"), type });
  }
  return results;
}

function chars(chunk: Chunk) {
  return chunk.text.length;
}
function approxTokens(chunk: Chunk) {
  return Math.ceil(chunk.text.length / 4);
}

function main() {
  const all = [
    ...readArticles(join(REPO_ROOT, "app/guides"), "guide"),
    ...readArticles(join(REPO_ROOT, "app/routines"), "routine"),
  ];

  console.log(`\nSMOKE TEST — MSR chunker against ${all.length} articles\n`);

  const allChunks: Chunk[] = [];
  const perArticle: { slug: string; type: string; chunkCount: number; totalTokens: number }[] = [];

  for (const article of all) {
    const chunks = chunkArticle({
      slug: article.slug,
      type: article.type,
      title: article.slug,
      rawMdx: article.raw,
    });
    allChunks.push(...chunks);
    perArticle.push({
      slug: article.slug,
      type: article.type,
      chunkCount: chunks.length,
      totalTokens: chunks.reduce((n, c) => n + approxTokens(c), 0),
    });
  }

  // Per-article summary
  console.log("PER-ARTICLE:");
  perArticle
    .sort((a, b) => b.totalTokens - a.totalTokens)
    .forEach((r) => {
      console.log(
        `  ${r.type.padEnd(7)} ${r.slug.padEnd(52)} ${String(r.chunkCount).padStart(2)} chunks · ~${String(r.totalTokens).padStart(4)} tokens`,
      );
    });

  // Distribution
  const tokenCounts = allChunks.map(approxTokens).sort((a, b) => a - b);
  const p50 = tokenCounts[Math.floor(tokenCounts.length * 0.5)];
  const p90 = tokenCounts[Math.floor(tokenCounts.length * 0.9)];
  const min = tokenCounts[0];
  const max = tokenCounts[tokenCounts.length - 1];
  const totalTokens = tokenCounts.reduce((n, t) => n + t, 0);

  console.log("\nCORPUS SUMMARY:");
  console.log(`  Articles         ${all.length}`);
  console.log(`  Total chunks     ${allChunks.length}`);
  console.log(`  Total tokens     ~${totalTokens.toLocaleString()}`);
  console.log(`  Chunk tokens     min ${min} · p50 ${p50} · p90 ${p90} · max ${max}`);
  console.log(`  Voyage embed $   ~$${((totalTokens / 1_000_000) * 0.02).toFixed(4)}`);

  // Anomaly check
  const oversized = allChunks.filter((c) => approxTokens(c) > 700);
  const undersized = allChunks.filter((c) => approxTokens(c) < 100);
  if (oversized.length > 0) {
    console.log(`\n  WARN: ${oversized.length} chunks over 700 tokens (target 500):`);
    oversized.slice(0, 3).forEach((c) => console.log(`    ${c.slug} #${c.chunkIndex} — ${approxTokens(c)} tokens`));
  }
  if (undersized.length > 0) {
    console.log(`\n  NOTE: ${undersized.length} chunks under 100 tokens (fine, but flagging):`);
    undersized.slice(0, 3).forEach((c) => console.log(`    ${c.slug} #${c.chunkIndex} — ${approxTokens(c)} tokens: "${c.text.slice(0, 60)}…"`));
  }

  // Sample chunk
  const sample = allChunks[Math.floor(allChunks.length / 2)];
  console.log("\nSAMPLE CHUNK (middle of corpus):");
  console.log(`  Slug:    ${sample.slug}`);
  console.log(`  Type:    ${sample.type}`);
  console.log(`  Section: ${sample.section ?? "(none)"}`);
  console.log(`  Tokens:  ~${approxTokens(sample)}`);
  console.log("  Text:");
  console.log(sample.text.split("\n").map((l) => `    ${l}`).join("\n").slice(0, 800));
  console.log("");
}

main();
