import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import Container from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { type } from "@/components/typography";
import {
  fetchAssessmentStats,
  gaConfigStatus,
  ASSESSMENT_EVENTS,
  type AssessmentStats,
} from "@/lib/ga-data";
import { fetchListSizes, type ListSizes } from "@/lib/list-size";

// Server component — runs on Node runtime (GA SDK needs Node crypto).
export const runtime = "nodejs";
// Always fresh — no cache. Small dashboard, low query cost.
export const dynamic = "force-dynamic";

// ── Access gate ──────────────────────────────────────────────────────────
// Query-param key check against ADMIN_KEY env var. Missing key OR wrong
// key → notFound(). This is not high-security auth — it's a "don't
// accidentally get indexed" gate. The route is also noindex-nofollow
// via the admin layout.

function isAuthorized(key: string | undefined): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false; // fail-closed if ADMIN_KEY missing
  return key === expected;
}

// ── Number formatting ────────────────────────────────────────────────────
const nf = new Intl.NumberFormat("en-US");
function fmt(n: number): string {
  return nf.format(n);
}
function pct(numer: number, denom: number): string {
  if (denom === 0) return "—";
  return `${((numer / denom) * 100).toFixed(1)}%`;
}

// ── Setup instructions block (rendered when env vars missing) ────────────
function SetupInstructions({ missing }: { missing: readonly string[] }) {
  return (
    <SiteLayout>
      <section className="bg-ink py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className={`${type.h1} text-inverse`}>Setup required.</h1>
            <p className={`mt-4 ${type.lead} text-inverse-body`}>
              The dashboard needs Google Analytics API credentials before it
              can pull numbers. One-time setup.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl article-body">
            <h2 className={`${type.h2} text-ink`}>What's missing</h2>
            <ul className="mt-4 list-disc pl-6">
              {missing.map((k) => (
                <li key={k}>
                  <code>{k}</code>
                </li>
              ))}
              <li>
                <code>ADMIN_KEY</code> (also needed to unlock this page)
              </li>
            </ul>

            <h2 className={`mt-12 ${type.h2} text-ink`}>Setup, one time</h2>
            <ol className="mt-4 list-decimal pl-6">
              <li>
                In Google Cloud Console, create a service account and enable
                the Analytics Data API v1. Download the JSON key.
              </li>
              <li>
                In GA4: Admin → Property → Property access management → add
                the service account email as a Viewer on property{" "}
                <code>534512448</code>.
              </li>
              <li>
                Base64-encode the JSON key:{" "}
                <code>base64 -i key.json | pbcopy</code>
              </li>
              <li>
                In Vercel: Project → Settings → Environment Variables. Add:
                <ul className="mt-2 list-disc pl-6">
                  <li>
                    <code>GA_PROPERTY_ID</code> = <code>534512448</code>
                  </li>
                  <li>
                    <code>GA_SERVICE_ACCOUNT_JSON_B64</code> = (the base64
                    blob)
                  </li>
                  <li>
                    <code>ADMIN_KEY</code> = (any string you'll remember)
                  </li>
                </ul>
              </li>
              <li>
                Redeploy. Then visit{" "}
                <code>/admin/assessment-stats?key=YOUR_ADMIN_KEY</code>.
              </li>
            </ol>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

// ── List-size widget ─────────────────────────────────────────────────────
// Queries Resend audience + Sanity assessmentSubmission at request time.
// Missing envs render "not configured" instead of failing.
function ListSizeSection({ sizes }: { sizes: ListSizes }) {
  return (
    <div className="mt-16">
      <h2 className={`${type.h2} text-ink`}>Email list</h2>
      <p className={`mt-3 ${type.body} text-neutral-600`}>
        Reachable contacts (Resend audience) + full submission history (Sanity).
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card variant="outline" className="p-6">
          <p className={`${type.small} text-neutral-500`}>Resend audience</p>
          {sizes.resendAudienceReady ? (
            <>
              <p className={`mt-2 ${type.h1} text-ink tabular-nums`}>
                {sizes.resendAudienceSize != null ? fmt(sizes.resendAudienceSize) : "—"}
              </p>
              <p className={`mt-2 ${type.small} text-neutral-500`}>
                Newsletter + assessment saves combined
              </p>
            </>
          ) : (
            <p className={`mt-2 ${type.small} text-neutral-500`}>
              Set <code>RESEND_API_KEY</code> and <code>RESEND_AUDIENCE_ID</code>{" "}
              in Vercel to see counts.
            </p>
          )}
        </Card>

        <Card variant="outline" className="p-6">
          <p className={`${type.small} text-neutral-500`}>Assessment submissions</p>
          {sizes.sanitySubmissionReady ? (
            <>
              <p className={`mt-2 ${type.h1} text-ink tabular-nums`}>
                {sizes.sanitySubmissionCount != null ? fmt(sizes.sanitySubmissionCount) : "—"}
              </p>
              <p className={`mt-2 ${type.small} text-neutral-500`}>
                Sanity <code>assessmentSubmission</code> documents (all-time)
              </p>
            </>
          ) : (
            <p className={`mt-2 ${type.small} text-neutral-500`}>
              Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> +{" "}
              <code>NEXT_PUBLIC_SANITY_DATASET</code> to see counts.
            </p>
          )}
        </Card>
      </div>

      {sizes.errors.length > 0 && (
        <ul className={`mt-4 ${type.small} text-signal-error space-y-1`}>
          {sizes.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ stats, sizes }: { stats: AssessmentStats; sizes: ListSizes }) {
  const started = stats.events.find((e) => e.name === "assessment_started")?.count ?? 0;
  const triage = stats.events.find((e) => e.name === "assessment_triage_done")?.count ?? 0;
  const results = stats.events.find((e) => e.name === "assessment_results_view")?.count ?? 0;
  const emails = stats.events.find((e) => e.name === "assessment_email_save")?.count ?? 0;
  const pdfs = stats.events.find((e) => e.name === "assessment_pdf_download")?.count ?? 0;

  const startedRate = pct(started, stats.assessmentPageviews);
  const completedRate = pct(results, started);
  const emailRate = pct(emails, results);

  return (
    <SiteLayout>
      <section className="bg-ink py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className={`${type.h1} text-inverse`}>Assessment stats.</h1>
            <p className={`mt-4 ${type.lead} text-inverse-body`}>
              Last {stats.rangeDays} days, GA4 property {process.env.GA_PROPERTY_ID}.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl">
            {/* Top-line KPIs */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card variant="outline" className="p-6">
                <p className={`${type.small} text-neutral-500`}>Started</p>
                <p className={`mt-2 ${type.h1} text-ink tabular-nums`}>
                  {fmt(started)}
                </p>
                <p className={`mt-2 ${type.small} text-neutral-500`}>
                  {startedRate} of /assessment pageviews
                </p>
              </Card>

              <Card variant="outline" className="p-6">
                <p className={`${type.small} text-neutral-500`}>Completed</p>
                <p className={`mt-2 ${type.h1} text-ink tabular-nums`}>
                  {fmt(results)}
                </p>
                <p className={`mt-2 ${type.small} text-neutral-500`}>
                  {completedRate} of started
                </p>
              </Card>

              <Card variant="outline" className="p-6">
                <p className={`${type.small} text-neutral-500`}>Emails captured</p>
                <p className={`mt-2 ${type.h1} text-ink tabular-nums`}>
                  {fmt(emails)}
                </p>
                <p className={`mt-2 ${type.small} text-neutral-500`}>
                  {emailRate} of completed
                </p>
              </Card>
            </div>

            {/* Funnel table */}
            <div className="mt-16">
              <h2 className={`${type.h2} text-ink`}>Funnel</h2>
              <p className={`mt-3 ${type.body} text-neutral-600`}>
                Event counts + drop-off from the previous step.
              </p>

              <table className="mt-6 w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className={`${type.body} font-medium py-3 pr-6 text-ink`}>
                      Event
                    </th>
                    <th className={`${type.body} font-medium py-3 pr-6 text-ink text-right`}>
                      Count
                    </th>
                    <th className={`${type.body} font-medium py-3 text-ink text-right`}>
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Order-matters funnel */}
                  <FunnelRow name="/assessment pageviews" count={stats.assessmentPageviews} of={stats.siteUsers} label="of site users" />
                  <FunnelRow name="assessment_started" count={started} of={stats.assessmentPageviews} label="of pageviews" />
                  <FunnelRow name="assessment_triage_done" count={triage} of={started} label="of started" />
                  <FunnelRow name="assessment_results_view" count={results} of={started} label="of started" />
                  <FunnelRow name="assessment_email_save" count={emails} of={results} label="of completed" />
                  <FunnelRow name="assessment_pdf_download" count={pdfs} of={results} label="of completed" />
                </tbody>
              </table>
            </div>

            {/* All events (raw) */}
            <div className="mt-16">
              <h2 className={`${type.h2} text-ink`}>All assessment events</h2>
              <p className={`mt-3 ${type.body} text-neutral-600`}>
                Every event in the taxonomy. Zero means either the affordance
                is unused or something upstream is broken.
              </p>

              <table className="mt-6 w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className={`${type.body} font-medium py-3 pr-6 text-ink`}>
                      Event
                    </th>
                    <th className={`${type.body} font-medium py-3 text-ink text-right`}>
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ASSESSMENT_EVENTS.map((name) => {
                    const count = stats.events.find((e) => e.name === name)?.count ?? 0;
                    return (
                      <tr key={name} className="border-b border-neutral-200">
                        <td className={`${type.body} py-3 pr-6 font-mono text-ink`}>
                          {name}
                        </td>
                        <td className={`${type.body} py-3 tabular-nums text-ink text-right`}>
                          {fmt(count)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* List sizes — Resend + Sanity totals */}
            <ListSizeSection sizes={sizes} />

            {/* Range switcher */}
            <div className="mt-12 flex items-center gap-3">
              <p className={`${type.small} text-neutral-500`}>Range:</p>
              {[7, 28, 90].map((d) => (
                <a
                  key={d}
                  href={`?days=${d}`}
                  className={`text-xs font-medium uppercase tracking-[0.05em] underline underline-offset-4 transition ${
                    d === stats.rangeDays
                      ? "text-ink"
                      : "text-neutral-500 hover:text-ink"
                  }`}
                >
                  {d}d
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

function FunnelRow({
  name,
  count,
  of,
  label,
}: {
  name: string;
  count: number;
  of: number;
  label: string;
}) {
  return (
    <tr className="border-b border-neutral-200">
      <td className={`${type.body} py-3 pr-6 font-mono text-ink`}>{name}</td>
      <td className={`${type.body} py-3 pr-6 tabular-nums text-ink text-right`}>
        {fmt(count)}
      </td>
      <td className={`${type.small} py-3 tabular-nums text-neutral-500 text-right`}>
        {pct(count, of)} {label}
      </td>
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default async function AssessmentStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; days?: string }>;
}) {
  const { key, days } = await searchParams;

  if (!isAuthorized(key)) notFound();

  const status = gaConfigStatus();
  if (!status.ready) {
    return <SetupInstructions missing={status.missing} />;
  }

  const rangeDays = Number(days) || 28;
  const [stats, sizes] = await Promise.all([
    fetchAssessmentStats(rangeDays),
    fetchListSizes(),
  ]);
  return <Dashboard stats={stats} sizes={sizes} />;
}
