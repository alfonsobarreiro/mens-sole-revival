import type { Metadata } from "next";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Design Critique — Homepage",
  description: "Internal design review of the Men's Sole Revival homepage. March 26, 2026.",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const usabilityFindings = [
  {
    severity: "moderate",
    finding: '"Learn more" CTA in the "BE FIRST." section is vague',
    fix: 'Replace with destination-specific copy: "Read our story" or "How we\'re building this"',
  },
  {
    severity: "moderate",
    finding: "All 3 Kit cards say \"Join waitlist →\" with no kit differentiation",
    fix: 'Pre-select kit in the waitlist destination, or use "Join Pain & Recovery waitlist"',
  },
  {
    severity: "moderate",
    finding: '"KNOW YOUR FEET" category list has no visible affordance for interaction',
    fix: 'Add a hover cursor indicator or a single line: "Hover a topic to explore →". The 01/06 counter isn\'t enough alone.',
  },
  {
    severity: "minor",
    finding: '"Browse the Library" hero CTA is borderline invisible against dark overlay',
    fix: "Increase outline weight to 2px or add 10% white background fill",
  },
];

const imageFindings = [
  {
    image: "Cracked heels article thumbnail",
    issue: "Shows a woman's face",
    action: "Replace with a male subject or a heel close-up",
    status: "fix",
  },
  {
    image: '"IT COMPOUNDS UPWARD." section photo',
    issue: "Yoga silhouette reads as female",
    action: "Swap for an active male recovery or training image",
    status: "fix",
  },
  {
    image: "Hero runner, PT session, shoe close-up",
    issue: "On-brand",
    action: "Keep",
    status: "keep",
  },
];

const a11yFindings = [
  {
    check: "Orange on white (stat callouts)",
    status: "fail",
    note: "High risk of WCAG AA fail at small sizes — test both instances",
  },
  {
    check: "White on dark hero overlay",
    status: "warn",
    note: "Likely passing — verify body copy at the left edge where overlay thins",
  },
  {
    check: "Scrolling ticker",
    status: "warn",
    note: "Check for prefers-reduced-motion support",
  },
  {
    check: "CTA touch targets",
    status: "pass",
    note: "Appear ≥44px tall",
  },
  {
    check: "Category interaction (keyboard)",
    status: "fail",
    note: "If hover-only, keyboard users are locked out — needs tab-focus support",
  },
];

const actionItems = [
  { done: false, priority: "critical", text: "Test orange-on-white contrast — fix if failing WCAG AA" },
  { done: false, priority: "high", text: 'Audit all images against "men over 40" audience brief — replace female-subject images' },
  { done: false, priority: "high", text: 'Replace "Learn more" CTA with specific destination copy' },
  { done: false, priority: "high", text: "Add interaction affordance to KNOW YOUR FEET category list" },
  { done: false, priority: "moderate", text: "Confirm Kit card CTAs pass kit context to waitlist form" },
  { done: false, priority: "moderate", text: "Add prefers-reduced-motion support to scrolling ticker" },
  { done: false, priority: "low", text: 'Remove duplicate "About" link from footer Company column' },
  { done: false, priority: "low", text: "Test category list keyboard navigation" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SeverityBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    critical: { label: "Critical",  cls: "bg-red-50 text-red-700 border-red-200" },
    moderate: { label: "Moderate",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
    minor:    { label: "Minor",     cls: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  };
  const { label, cls } = map[level] ?? map.minor;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    fail: "bg-red-500",
    warn: "bg-amber-400",
    pass: "bg-emerald-500",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[status] ?? "bg-neutral-400"}`} />;
}

function PriorityPip({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    critical: "bg-red-500",
    high:     "bg-amber-400",
    moderate: "bg-brand-400",
    low:      "bg-neutral-300",
  };
  return <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${map[priority] ?? "bg-neutral-300"}`} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${type.overline} mb-3 text-accent-600`}>{children}</p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DesignCritiquePage() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="border-b border-neutral-200 bg-brand-900 py-14 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className={`${type.overline} text-accent-400`}>Internal · Design Review</p>
            <h1 className={`mt-3 ${type.displaySection} text-white`}>
              Homepage Critique
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-300">
              Structured review of{" "}
              <code className="rounded bg-brand-800 px-1.5 py-0.5 text-sm text-brand-200">
                localhost:3001/
              </code>{" "}
              — Men's Sole Revival homepage. March 26, 2026.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Overall Impression ── */}
      <section className="border-b border-neutral-200 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <SectionLabel>First read</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>Overall Impression</h2>
            <p className="mt-5 text-base leading-7 text-neutral-700">
              Strong brand voice, confident editorial direction.{" "}
              <strong className="font-semibold text-brand-900">
                "FIX YOUR FEET. KEEP UP WITH EVERYTHING ELSE."
              </strong>{" "}
              lands immediately and reframes foot care as a performance issue — not a vanity
              one. That's the right call for the target audience. The biggest opportunity: a
              few execution gaps undercut what's otherwise a differentiated, senior-level
              design decision.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Priority 1: Accessibility blocker ── */}
      <section className="border-b border-neutral-200 bg-red-50 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <SectionLabel>Priority 1 — Fix before launch</SectionLabel>
            <h2 className={`${type.h2} text-red-800`}>Orange Text Contrast</h2>
            <p className="mt-4 text-base leading-7 text-neutral-700">
              Orange text on a white background at small sizes frequently fails WCAG AA (4.5:1
              minimum ratio). Two instances are at risk on the current homepage:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                '"That\'s probably someone in your household." — stats section',
                '"Most of what slows men down after 40 was preventable." — stats section',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-red-200 bg-white p-4">
              <p className={`${type.label} text-red-700`}>Recommended fix</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">
                Test both instances with a contrast checker. If failing, darken the orange ~15%
                or increase font weight. This is the only potential hard blocker before public
                launch.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Usability ── */}
      <section className="border-b border-neutral-200 py-12 md:py-16">
        <Container>
          <div className="mb-8 max-w-xl">
            <SectionLabel>Usability</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>Interaction Gaps</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className={`${type.overline} pb-3 pr-6 text-left`}>Severity</th>
                  <th className={`${type.overline} pb-3 pr-6 text-left`}>Finding</th>
                  <th className={`${type.overline} pb-3 text-left`}>Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {usabilityFindings.map((row, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-4 pr-6">
                      <SeverityBadge level={row.severity} />
                    </td>
                    <td className="py-4 pr-6 leading-6 text-neutral-700">{row.finding}</td>
                    <td className="py-4 leading-6 text-neutral-600">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── Visual Hierarchy ── */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <SectionLabel>Visual hierarchy</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>Reading Flow by Section</h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  section: "Hero",
                  status: "pass",
                  note: "Eyebrow → Headline → Body → CTAs → reassurance line. Clean, disciplined. Eye goes to headline first — correct.",
                },
                {
                  section: "Stats",
                  status: "warn",
                  note: 'Section label "THE NUMBERS MOST MEN IGNORE" is nearly invisible — too small, too low-contrast. Either remove it or give it more weight.',
                },
                {
                  section: '"FROM THE LIBRARY."',
                  status: "warn",
                  note: "Stacked massive heading burns real estate to label what could be a smaller header. The articles are the value; they deserve more visual weight above the fold.",
                },
                {
                  section: "Category browser",
                  status: "warn",
                  note: "Elegant hover mechanic, but requires interaction to understand. The 01/06 counter is a hint, not a clear affordance.",
                },
                {
                  section: "BE FIRST. CTA",
                  status: "pass",
                  note: 'Headline lands. "Join the Waitlist" primary CTA is visible. "Learn more" secondary is weak copy — but hierarchy of the two buttons is correct.',
                },
              ].map((row) => (
                <div key={row.section} className="flex gap-4">
                  <StatusDot status={row.status} />
                  <div>
                    <p className={`${type.label} text-brand-900`}>{row.section}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{row.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Image Audit ── */}
      <section className="border-b border-neutral-200 py-12 md:py-16">
        <Container>
          <div className="mb-8 max-w-xl">
            <SectionLabel>Image audit</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>Audience Alignment</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              The brand is explicitly positioned for men 40+. Several images create audience
              dissonance.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className={`${type.overline} pb-3 pr-6 text-left`}>Image</th>
                  <th className={`${type.overline} pb-3 pr-6 text-left`}>Issue</th>
                  <th className={`${type.overline} pb-3 text-left`}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {imageFindings.map((row, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-4 pr-6 font-medium text-neutral-800">{row.image}</td>
                    <td className="py-4 pr-6 text-neutral-600">{row.issue}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          row.status === "keep"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status === "keep" ? "✓ Keep" : "Replace"}
                      </span>
                      <span className="ml-2 text-neutral-600">{row.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── Accessibility ── */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <Container>
          <div className="mb-8 max-w-xl">
            <SectionLabel>Accessibility</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>WCAG AA Snapshot</h2>
          </div>
          <div className="max-w-3xl space-y-3">
            {a11yFindings.map((row, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="mt-1 flex-shrink-0">
                  <StatusDot status={row.status} />
                </div>
                <div>
                  <p className={`${type.label} text-brand-900`}>{row.check}</p>
                  <p className="mt-0.5 text-sm leading-6 text-neutral-600">{row.note}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      row.status === "pass"
                        ? "text-emerald-600"
                        : row.status === "warn"
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {row.status === "pass" ? "Pass" : row.status === "warn" ? "Verify" : "Flag"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-400">
            Legend: <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Pass</span>
            {" · "}
            <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Verify</span>
            {" · "}
            <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Flag</span>
          </p>
        </Container>
      </section>

      {/* ── What's Working ── */}
      <section className="border-b border-neutral-200 py-12 md:py-16">
        <Container>
          <div className="max-w-xl">
            <SectionLabel>Signal</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>What's Working</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                heading: '"FIX YOUR FEET. KEEP UP WITH EVERYTHING ELSE."',
                body: "One of the clearest value props in a health product. Specific, direct, no hedging. Reframes foot care as a performance issue.",
              },
              {
                heading: '"No commerce yet — we\'re building this in the open."',
                body: "Excellent trust signal. Most pre-launch products hide the fact they're pre-launch. This does the opposite — and earns credibility for it.",
              },
              {
                heading: "Stats section — 1 in 4 / 75%",
                body: "Concrete numbers with emotionally sharp editorial callouts. Stakes the problem personally without fear-baiting.",
              },
              {
                heading: "Editorial layout direction",
                body: "Asymmetric library section, dark hero, split compound section. Reads like a magazine, not a supplement store. That differentiation is the core bet.",
              },
              {
                heading: "Kit cards",
                body: "Clean, scannable. Tag labels (MOST REQUESTED, LONG GAME, FOUNDATION) do real IA work — each kit has a reason-to-exist beyond its name.",
              },
              {
                heading: "Three-typeface system",
                body: "Each face has a single defined role: Barlow Condensed for architectural authority, Lora for editorial warmth, DM Sans for UI clarity. No drift.",
              },
            ].map((item) => (
              <div key={item.heading} className="rounded-lg border border-neutral-200 p-5">
                <div className="mb-3 h-0.5 w-6 rounded-full bg-accent-500" />
                <h3 className={`${type.h4} text-brand-900`}>{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Action Checklist ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-xl">
            <SectionLabel>Next steps</SectionLabel>
            <h2 className={`${type.h2} text-brand-900`}>Priority Action List</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              8 items, ordered by priority. The orange contrast check is the only hard blocker.
            </p>
          </div>
          <div className="mt-8 max-w-2xl space-y-2">
            {actionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                {/* Checkbox visual */}
                <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 border-neutral-300 bg-white" />
                <PriorityPip priority={item.priority} />
                <p className="text-sm leading-6 text-neutral-700">{item.text}</p>
                <span
                  className={`ml-auto flex-shrink-0 text-xs font-semibold uppercase tracking-wide ${
                    item.priority === "critical"
                      ? "text-red-500"
                      : item.priority === "high"
                      ? "text-amber-600"
                      : item.priority === "moderate"
                      ? "text-brand-500"
                      : "text-neutral-400"
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> High</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-brand-400" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-neutral-300" /> Low</span>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
