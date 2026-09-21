/**
 * Build the chatbot's search index: read every guide + routine MDX file,
 * chunk each, embed each chunk through Vercel AI Gateway, and write
 * lib/chat/embeddings.json. Re-run whenever an article is added or edited.
 *
 *   pnpm dlx tsx --env-file=.env.local scripts/build-embeddings.ts
 *
 * The output ships in the app bundle and is loaded once per cold start by the
 * /ask route. A full rebuild of the current corpus costs about $0.001.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { chunkArticle, extractTitle, type Chunk } from "../lib/chat/chunk";
import { embedTexts, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "../lib/chat/embed";
import { guideSeo, routineSeo } from "../lib/guide-seo";

const REPO_ROOT = resolve(__dirname, "..");
const GUIDES_DIR = join(REPO_ROOT, "app/guides");
const ROUTINES_DIR = join(REPO_ROOT, "app/routines");
const OUT_PATH = join(REPO_ROOT, "lib/chat/embeddings.json");

// One request for the whole corpus: the gateway's free tier allows only a few
// embedding requests per minute, and ~45k tokens fits in a single call.
const BATCH_SIZE = 128;
const VECTOR_DECIMALS = 6;
const MAX_RATE_LIMIT_RETRIES = 4;
const RATE_LIMIT_WAIT_MS = 20_000;

async function embedWithRetry(texts: string[]) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await embedTexts(texts);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const rateLimited = message.includes(" 429:");
      if (!rateLimited || attempt >= MAX_RATE_LIMIT_RETRIES) throw err;
      console.log(`  rate limited by the gateway, waiting ${RATE_LIMIT_WAIT_MS / 1000}s...`);
      await new Promise((r) => setTimeout(r, RATE_LIMIT_WAIT_MS));
    }
  }
}

function readArticles(baseDir: string): { slug: string; raw: string }[] {
  return readdirSync(baseDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ slug: e.name, mdxPath: join(baseDir, e.name, "article.mdx") }))
    .filter(({ mdxPath }) => existsSync(mdxPath))
    .map(({ slug, mdxPath }) => ({ slug, raw: readFileSync(mdxPath, "utf8") }));
}

async function main() {
  const guides = readArticles(GUIDES_DIR);
  const routines = readArticles(ROUTINES_DIR);
  console.log(`Read ${guides.length} guides and ${routines.length} routines.`);

  const allChunks: Chunk[] = [];
  for (const { slug, raw } of guides) {
    const title = guideSeo[slug]?.metaTitle || extractTitle(raw) || slug;
    allChunks.push(...chunkArticle({ slug, type: "guide", title, rawMdx: raw }));
  }
  for (const { slug, raw } of routines) {
    const title = routineSeo[slug]?.metaTitle || extractTitle(raw) || slug;
    allChunks.push(...chunkArticle({ slug, type: "routine", title, rawMdx: raw }));
  }
  console.log(`Chunked into ${allChunks.length} passages.`);

  const embedded: (Chunk & { embedding: number[] })[] = [];
  let totalTokens = 0;
  let totalCost = 0;

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const { vectors, totalTokens: tokens, cost } = await embedWithRetry(batch.map((c) => c.text));
    if (vectors.length !== batch.length) {
      throw new Error(`Gateway returned ${vectors.length} vectors for ${batch.length} passages.`);
    }
    batch.forEach((chunk, j) => {
      embedded.push({
        ...chunk,
        embedding: vectors[j].map((x) => Number(x.toFixed(VECTOR_DECIMALS))),
      });
    });
    totalTokens += tokens;
    totalCost += cost;
    console.log(`  embedded ${Math.min(i + BATCH_SIZE, allChunks.length)}/${allChunks.length}`);
  }

  const dimension = embedded[0]?.embedding.length ?? 0;
  if (dimension !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Expected ${EMBEDDING_DIMENSIONS}-dim vectors, got ${dimension}.`);
  }

  // Compact JSON: the vectors are most of the file, and indentation would triple it.
  writeFileSync(
    OUT_PATH,
    JSON.stringify({
      model: EMBEDDING_MODEL,
      dimension,
      builtAt: new Date().toISOString(),
      chunkCount: embedded.length,
      chunks: embedded,
    }),
  );

  console.log(
    `Wrote ${OUT_PATH}\n  ${embedded.length} passages, ${dimension} dims, ` +
      `${totalTokens.toLocaleString()} tokens, $${totalCost.toFixed(6)} reported cost.`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
