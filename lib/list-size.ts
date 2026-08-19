/**
 * Email + submission totals for the /admin/assessment-stats dashboard.
 *
 * Resend audience is the source of truth for reachable emails (newsletter
 * + assessment saves both add contacts here). Sanity assessmentSubmission
 * is the population-level record of every submission (email + flags).
 *
 * Both are queried at request-time from the /admin dashboard.
 */

const RESEND_API = "https://api.resend.com";

export interface ListSizes {
  resendAudienceSize: number | null;
  resendAudienceReady: boolean;
  sanitySubmissionCount: number | null;
  sanitySubmissionReady: boolean;
  errors: string[];
}

/** Sum contact pages via Resend API. Simple pagination for lists up to ~1000. */
async function fetchResendAudienceSize(): Promise<number | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;

  let total = 0;
  let after: string | undefined = undefined;
  // Cap loops so a runaway pagination can't hang the page.
  for (let i = 0; i < 20; i++) {
    const url = new URL(`${RESEND_API}/audiences/${audienceId}/contacts`);
    url.searchParams.set("limit", "100");
    if (after) url.searchParams.set("after", after);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as {
      data: Array<{ id: string }>;
      has_more?: boolean;
    };
    total += json.data.length;
    if (!json.has_more || json.data.length === 0) break;
    after = json.data[json.data.length - 1]?.id;
    if (!after) break;
  }
  return total;
}

/** Count assessmentSubmission documents in Sanity via GROQ. */
async function fetchSanitySubmissionCount(): Promise<number | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
  const token = process.env.SANITY_API_WRITE_TOKEN; // read scope covered by write token
  if (!projectId || !dataset) return null;

  const query = encodeURIComponent(`count(*[_type == "assessmentSubmission"])`);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { result: number };
  return json.result ?? 0;
}

export async function fetchListSizes(): Promise<ListSizes> {
  const errors: string[] = [];

  const resendReady = Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID,
  );
  const sanityReady = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  );

  const [resend, sanity] = await Promise.allSettled([
    resendReady ? fetchResendAudienceSize() : Promise.resolve(null),
    sanityReady ? fetchSanitySubmissionCount() : Promise.resolve(null),
  ]);

  let resendAudienceSize: number | null = null;
  let sanitySubmissionCount: number | null = null;

  if (resend.status === "fulfilled") {
    resendAudienceSize = resend.value;
  } else {
    errors.push(`Resend: ${resend.reason?.message ?? String(resend.reason)}`);
  }

  if (sanity.status === "fulfilled") {
    sanitySubmissionCount = sanity.value;
  } else {
    errors.push(`Sanity: ${sanity.reason?.message ?? String(sanity.reason)}`);
  }

  return {
    resendAudienceSize,
    resendAudienceReady: resendReady,
    sanitySubmissionCount,
    sanitySubmissionReady: sanityReady,
    errors,
  };
}
