import { countSubmissions, submissionsConfigured } from "@/lib/submissions/store";
/**
 * Email + submission totals for the /admin/assessment-stats dashboard.
 *
 * Resend audience is the source of truth for reachable emails (newsletter
 * + assessment saves both add contacts here). The submissions store
 * (Postgres, lib/submissions/store.ts) is the population-level record of
 * every submission.
 *
 * Both are queried at request-time from the /admin dashboard.
 */

const RESEND_API = "https://api.resend.com";

export interface ListSizes {
  resendAudienceSize: number | null;
  resendAudienceReady: boolean;
  submissionCount: number | null;
  submissionStoreReady: boolean;
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

export async function fetchListSizes(): Promise<ListSizes> {
  const errors: string[] = [];

  const resendReady = Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID,
  );
  const storeReady = submissionsConfigured();

  const [resend, store] = await Promise.allSettled([
    resendReady ? fetchResendAudienceSize() : Promise.resolve(null),
    storeReady ? countSubmissions() : Promise.resolve(null),
  ]);

  let resendAudienceSize: number | null = null;
  let submissionCount: number | null = null;

  if (resend.status === "fulfilled") {
    resendAudienceSize = resend.value;
  } else {
    errors.push(`Resend: ${resend.reason?.message ?? String(resend.reason)}`);
  }

  if (store.status === "fulfilled") {
    submissionCount = store.value;
  } else {
    errors.push(`Submissions: ${store.reason?.message ?? String(store.reason)}`);
  }

  return {
    resendAudienceSize,
    resendAudienceReady: resendReady,
    submissionCount,
    submissionStoreReady: storeReady,
    errors,
  };
}
