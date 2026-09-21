/**
 * Text → embedding vectors through Vercel AI Gateway.
 *
 * Shared by the build-time index script (scripts/build-embeddings.ts) and the
 * runtime /ask route, so article passages and visitor questions are always
 * embedded by the same model at the same size. Mixing models or sizes would
 * make the similarity scores meaningless.
 *
 * Auth: AI_GATEWAY_API_KEY locally and on Vercel; VERCEL_OIDC_TOKEN is the
 * fallback Vercel injects into deployments.
 */

export const EMBEDDING_MODEL = "voyage/voyage-4-lite";
export const EMBEDDING_DIMENSIONS = 512;

const GATEWAY_EMBEDDINGS_URL = "https://ai-gateway.vercel.sh/v1/embeddings";

type GatewayEmbeddingResponse = {
  data: { index: number; embedding: number[] }[];
  usage?: { total_tokens?: number };
  providerMetadata?: { gateway?: { cost?: string } };
};

export type EmbedResult = {
  vectors: number[][];
  totalTokens: number;
  /** Dollar cost as reported by the gateway, when present. */
  cost: number;
};

/**
 * Trim to EMBEDDING_DIMENSIONS and scale to length 1, so cosine similarity
 * reduces to a dot product.
 *
 * The gateway does not reliably honor `dimensions` for Voyage models (it
 * returned 1024 when asked for 512 on 2026-09-21). Voyage's models are trained
 * so a leading slice of the vector is itself a valid embedding, which makes
 * trimming here equivalent to asking the API for the smaller size. Doing it in
 * one place keeps passages and questions the same shape no matter what the
 * gateway returns.
 */
function trimAndNormalize(vector: number[]): number[] {
  const trimmed =
    vector.length > EMBEDDING_DIMENSIONS ? vector.slice(0, EMBEDDING_DIMENSIONS) : vector;
  let sumSquares = 0;
  for (const x of trimmed) sumSquares += x * x;
  const length = Math.sqrt(sumSquares);
  if (length === 0) return trimmed;
  return trimmed.map((x) => x / length);
}

/** Gateway failure with its HTTP status, so callers can tell a spent budget (402) from a hiccup. */
export class EmbeddingError extends Error {
  constructor(
    public readonly status: number,
    detail: string,
  ) {
    super(`AI Gateway embeddings ${status}: ${detail}`);
    this.name = "EmbeddingError";
  }
}

export async function embedTexts(texts: string[]): Promise<EmbedResult> {
  const apiKey = process.env.AI_GATEWAY_API_KEY ?? process.env.VERCEL_OIDC_TOKEN;
  if (!apiKey) {
    throw new Error("No AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN in the environment.");
  }

  const res = await fetch(GATEWAY_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!res.ok) {
    // The gateway's error body never contains the key, so it is safe to surface.
    throw new EmbeddingError(res.status, await res.text());
  }

  const json = (await res.json()) as GatewayEmbeddingResponse;
  const vectors = json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => trimAndNormalize(d.embedding));

  return {
    vectors,
    totalTokens: json.usage?.total_tokens ?? 0,
    cost: Number(json.providerMetadata?.gateway?.cost ?? 0),
  };
}
