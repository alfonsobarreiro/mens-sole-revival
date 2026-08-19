/**
 * GA4 Data API client — server-only. Queries the Analytics Data API for
 * assessment_* funnel event counts + top-line pageviews.
 *
 * Setup (once, in Google Cloud + GA4 + Vercel):
 *   1. In GCP: create a service account, enable Analytics Data API v1.
 *      Download the JSON key.
 *   2. In GA4: Admin → Property → Property access management → add the
 *      service account email as a Viewer.
 *   3. Base64-encode the JSON key: `base64 -i key.json | pbcopy`
 *   4. In Vercel: add env vars
 *        GA_PROPERTY_ID              (e.g. 534512448)
 *        GA_SERVICE_ACCOUNT_JSON_B64 (the base64 blob)
 *        ADMIN_KEY                   (any string; used as a query-param
 *                                     gate on /admin/assessment-stats)
 *
 * Missing env vars = the /admin route renders setup instructions instead
 * of failing.
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";

const REQUIRED_ENV = [
  "GA_PROPERTY_ID",
  "GA_SERVICE_ACCOUNT_JSON_B64",
] as const;

export function gaConfigStatus(): { ready: boolean; missing: string[] } {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  return { ready: missing.length === 0, missing };
}

function getClient(): BetaAnalyticsDataClient {
  const b64 = process.env.GA_SERVICE_ACCOUNT_JSON_B64!;
  const json = Buffer.from(b64, "base64").toString("utf-8");
  const credentials = JSON.parse(json) as { client_email: string; private_key: string };
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  });
}

/**
 * Assessment funnel events, in order the user emits them.
 * Kept in sync with lib/analytics.ts → AssessmentEvent taxonomy.
 */
export const ASSESSMENT_EVENTS = [
  "assessment_started",
  "assessment_triage_done",
  "assessment_section_done",
  "assessment_section_skip",
  "assessment_results_view",
  "assessment_email_save",
  "assessment_pdf_download",
  "assessment_article_click",
  "assessment_routine_click",
  "assessment_review_click",
  "assessment_restart",
  "assessment_feedback_sent",
] as const;

export type AssessmentEventName = (typeof ASSESSMENT_EVENTS)[number];

export interface EventCount {
  name: AssessmentEventName;
  count: number;
}

export interface AssessmentStats {
  rangeDays: number;
  startDate: string;
  endDate: string;
  events: EventCount[];
  assessmentPageviews: number;
  siteUsers: number;
}

/**
 * Fetches assessment_* event counts + top-line pageviews for the given
 * lookback window (default 28 days).
 */
export async function fetchAssessmentStats(
  rangeDays: number = 28,
): Promise<AssessmentStats> {
  const client = getClient();
  const propertyId = process.env.GA_PROPERTY_ID!;
  const property = `properties/${propertyId}`;
  const startDate = `${rangeDays}daysAgo`;
  const endDate = "today";

  // Query 1 — event counts for the assessment funnel
  const [eventsRes] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: [...ASSESSMENT_EVENTS] },
      },
    },
  });

  const eventMap = new Map<string, number>();
  for (const row of eventsRes.rows ?? []) {
    const name = row.dimensionValues?.[0]?.value ?? "";
    const count = Number(row.metricValues?.[0]?.value ?? 0);
    eventMap.set(name, count);
  }
  const events: EventCount[] = ASSESSMENT_EVENTS.map((name) => ({
    name,
    count: eventMap.get(name) ?? 0,
  }));

  // Query 2 — /assessment pageviews + total site users, same range
  const [siteRes] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "totalUsers" }],
  });
  const siteUsers = Number(siteRes.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  const [pvRes] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "EXACT", value: "/assessment" },
      },
    },
  });
  const assessmentPageviews = Number(pvRes.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  return {
    rangeDays,
    startDate,
    endDate,
    events,
    assessmentPageviews,
    siteUsers,
  };
}
