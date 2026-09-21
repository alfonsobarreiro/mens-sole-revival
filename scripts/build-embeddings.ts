/**
 * Build-time script: read every guide + routine MDX file, chunk each,
 * embed each chunk via Voyage (voyage-3-lite), and write the result to
 * lib/chat/embeddings.json.
 *
 * Run manually before deploy (or wire into `npm run build`):
 *
 *   VOYAGE_API_KEY=... npx tsx scripts/build-embeddings.ts
 *
 * The output JSON is shipped in the app bundle and loaded once per cold
 * start by the /ask route handler. Voyage-3-lite is $0.02 per million tokens;
 * the full corpus is ~30k tokens so a full rebuild costs ~$0.0006.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chunkArticle, extractTitle, type Chunk } from "../lib/chat/chunk";
import { guideSeo, routineSeo } from "../lib/guide-seo";

const REPO_ROOT = resolve(__dirname, "..");
const GUIDES_DIR = join(REPO_ROOT, "app/guides");
const ROUTINES_DIR = join(REPO_ROOT, "app/routines");
const OUT_PATH = join(REPO_ROOT, "lib/chat/embeddings.json");

const VOYAGE_MODEL = "voyage-3-lite";
const VOYAGE_ENDPOINT = "https://api.voyageai.com/v1/embeddings";
const BATCH_SIZE = 32; // Voyage supports up to 128 per call.

/** Read all article.mdx files under a directory, one per subfolder = one slug. */
function readArticles(baseDir: string, type: "guide" | "routine"): {
  slug: string;
  raw: string;
}[] {
  const entries = readdirSync(baseDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const results: { slug: string; raw: string }[] = [];
  for (const slug of entries) {
    const mdxPath = join(baseDir, slug, "article.mdx");
    try {
      statSync(mdxPath);
    } catch {
      continue; // Not every directory has an article.mdx (e.g. /routines index).
    }
    results.push({ slug, raw: readFileSync(mdxPath, "utf8") });
  }
  return results;
}

async function embedBatch(texts: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch(VOYAGE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: "document",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Voyage API ${res.status}: ${body}`);
  }

  const json = (await res.json()) as {
    data: { embedding: number[]; index: number }[];
  };

  // Voyage returns items with indices; sort defensively so the order matches
  // the input order.
  return json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

async function main() {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    console.error("VOYAGE_API_KEY not set. Aborting.");
    process.exit(1);
  }

  console.log("Reading MDX files…");
  const guides = readArticles(GUIDES_DIR, "guide");
  const routines = readArticles(ROUTINES_DIR, "routine");
  console.log(`  ${guides.length} guides, ${routines.length} routines.`);

  console.log("Chunking…");
  const allChunks: Chunk[] = [];
  for (const { slug, raw } of guides) {
    const title = guideSeo[slug]?.metaTitle ?? extractTitle(raw) ?? slug;
    const chunks = chunkArticle({ slug, type: "guide", title, rawMdx: raw });
    allChunks.push(...chunks);
  }
  for (const { slug, raw } of routines) {
    const title = routineSeo[slug]?.metaTitle ?? extractTitle(raw) ?? slug;
    const chunks = chunkArticle({ slug, type: "routine", title, rawMdx: raw });
    allChunks.push(...chunks);
  }
  const approxTokens = allChunks.reduce((n, c) => n + Math.ceil(c.text.length / 4), 0);
  console.log(
    `  ${allChunks.length} chunks, ~${approxTokens.toLocaleString()} tokens ` +
      `(≈ $${((approxTokens / 1_000_000) * 0.02).toFixed(4)} to embed).`,
  );

  console.log("Embedding via Voyage…");
  const embedded: (Chunk & { embedding: number[] })[] = [];
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const vectors = await embedBatch(
      batch.map((c) => c.text),
      apiKey,
    );
    for (let j = 0; j < batch.length; j++) {
      embedded.push({ ...batch[j], embedding: vectors[j] });
    }
    console.log(`  batched ${Math.min(i + BATCH_SIZE, allChunks.length)}/${allChunks.length}`);
  }

  console.log(`Writing ${OUT_PATH}…`);
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        model: VOYAGE_MODEL,
        builtAt: new Date().toISOString(),
        chunkCount: embedded.length,
        dimension: embedded[0]?.embedding.length ?? 0,
        chunks: embedded,
      },
      null,
      2,
    ),
  );
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
