import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Men's Sole Revival collects, why, who else handles it, and how to have it deleted. No selling, no ad tracking.",
  alternates: { canonical: "/privacy" },
};

// Plain-language privacy policy. Every statement here matches what the code
// does as of the date below; update both together. Inventory, 2026-09-25:
//   - Newsletter: email -> Resend audience (double opt-in).
//   - Assessment "email me my results": email + answers -> Neon Postgres
//     (lib/submissions/schema.sql) and a pending Resend contact.
//   - Assessment feedback: emailed to the owner.
//   - Assistant (/ask): question -> Vercel AI Gateway (Voyage embeddings) and
//     Anthropic; nothing stored or logged (app/api/ask/route.ts). BotID check.
//   - Analytics, production only: GA4, Microsoft Clarity (masked on the chat,
//     off on /progress and /admin), Vercel Web Analytics (cookieless).
//   - Cookies we set: msr_progress (24h), msr_admin (owner only).

const UPDATED = "September 25, 2026";
const CONTACT = "alfonso@barreiro.com";

const link = "text-brand-600 underline underline-offset-4 hover:text-brand-900";
const h2 = `mt-12 ${type.h2}`;
const p = `mt-4 ${type.body}`;
const list = `mt-4 list-disc space-y-3 pl-5 ${type.body}`;

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <Container>
        <article className="max-w-2xl py-16 md:py-24">
          <p className={type.overline}>Last updated {UPDATED}</p>
          <h1 className={`mt-3 ${type.h1}`}>Privacy policy</h1>
          <p className={`mt-6 ${type.lead}`}>
            This page says what Men&apos;s Sole Revival collects, why, who else handles it, and how
            to have it deleted. The site collects only what it needs to send you what you asked
            for and to see which pages help. None of it is sold or used for advertising.
          </p>

          <h2 className={h2}>What we collect and why</h2>
          <ul className={list}>
            <li>
              <strong>Your email address, when you sign up for the newsletter.</strong> We send one
              confirmation email. You&apos;re only on the list after you click the link in it.
            </li>
            <li>
              <strong>Your assessment results, when you email them to yourself.</strong> We store
              your email address, the date, your answers by section, how many items you flagged,
              the time you spent on each section, and whether you asked for check-ins. We use them
              to email your results, to show your progress page, and to send the 30-day and 90-day
              check-ins if you ticked that box. Emailing your results doesn&apos;t add you to the
              newsletter unless you click the confirmation link in that email.
            </li>
            <li>
              <strong>Assessment feedback, if you leave it.</strong> Your rating and any comment
              arrive in the site owner&apos;s inbox by email.
            </li>
            <li>
              <strong>Questions you ask Alfred, the site&apos;s assistant.</strong> These are
              covered in the next section.
            </li>
          </ul>

          <h2 className={h2}>The assistant</h2>
          <p className={p}>
            When you ask Alfred a question, what you type goes to two services so he can answer.
            Vercel&apos;s AI Gateway sends it to Voyage AI to find the guides that match, and
            Anthropic&apos;s Claude model writes the reply. Men&apos;s Sole Revival doesn&apos;t
            store or log your questions or the answers, and the conversation is gone when you close
            the page. Anthropic doesn&apos;t train its models on messages sent through its
            commercial API. Please leave out your name and contact details.
          </p>
          <p className={p}>
            Before a question is sent, a security check from Vercel runs in your browser to block
            automated abuse. Alfred isn&apos;t a doctor and doesn&apos;t diagnose.
          </p>

          <h2 className={h2}>Analytics</h2>
          <p className={p}>These run on the live site only.</p>
          <ul className={list}>
            <li>
              <strong>Google Analytics</strong> records which pages you visit, how you arrived,
              your device and browser type, your approximate location, and actions such as signing
              up for the newsletter. It uses cookies. It never receives what you type into the
              assessment or the assistant.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> records how pages are used, such as clicks,
              scrolling, and session replays, so we can find the parts that confuse people. It uses
              cookies. It hides the assistant&apos;s conversation and doesn&apos;t run on the
              progress page.
            </li>
            <li>
              <strong>Vercel Web Analytics</strong> counts page views without cookies.
            </li>
          </ul>

          <h2 className={h2}>Cookies</h2>
          <p className={p}>
            Google Analytics and Microsoft Clarity set cookies to tell visits apart. The site sets
            one cookie of its own for visitors: when you open a progress link from your email, a
            cookie lets the progress page show your results for 24 hours without an account. A
            second cookie is used only by the site owner to reach the admin page. There are no
            advertising cookies. You can block or delete cookies in your browser; the site still
            works, and the progress page will ask you for a new link.
          </p>

          <h2 className={h2}>Who else handles your information</h2>
          <p className={p}>
            These companies run parts of the site for us and handle your information only to do
            that work:
          </p>
          <ul className={list}>
            <li>
              <strong>Vercel</strong> hosts the site. Its servers log standard request details, such
              as IP address and browser, for security and to enforce rate limits. It also runs Web
              Analytics, the security check, and the AI Gateway.
            </li>
            <li>
              <strong>Neon</strong> hosts the database that stores assessment results.
            </li>
            <li>
              <strong>Resend</strong> sends the site&apos;s emails and holds the newsletter list.
            </li>
            <li>
              <strong>Google</strong> and <strong>Microsoft</strong> provide the analytics above.
            </li>
            <li>
              <strong>Anthropic</strong> and <strong>Voyage AI</strong> process questions asked of
              the assistant.
            </li>
          </ul>
          <p className={p}>We don&apos;t sell or rent personal information, and we don&apos;t share it for advertising.</p>

          <h2 className={h2}>How long we keep it</h2>
          <ul className={list}>
            <li>Newsletter addresses stay on the list until you unsubscribe.</li>
            <li>Assessment results stay in the database until you ask us to delete them.</li>
            <li>Feedback emails stay in the site owner&apos;s inbox.</li>
            <li>Questions asked of the assistant aren&apos;t kept by us at all.</li>
          </ul>

          <h2 className={h2}>Your choices</h2>
          <ul className={list}>
            <li>
              Newsletter emails have an unsubscribe link, and check-in emails have a link to stop the
              check-ins. The other emails, such as your results or a progress link, are one-off replies
              to something you asked for.
            </li>
            <li>
              To see, correct, or delete what we hold about you, email{" "}
              <a href={`mailto:${CONTACT}`} className={link}>
                {CONTACT}
              </a>
              . We reply within 30 days.
            </li>
            <li>
              You can block cookies in your browser, or opt out of Google Analytics everywhere with{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" className={link} rel="noopener">
                Google&apos;s opt-out add-on
              </a>
              .
            </li>
          </ul>

          <h2 className={h2}>Children</h2>
          <p className={p}>The site is written for adults and isn&apos;t meant for anyone under 18.</p>

          <h2 className={h2}>Changes to this policy</h2>
          <p className={p}>
            When what the site collects changes, this page changes with it, and the date at the top
            moves. Questions about any of this go to{" "}
            <a href={`mailto:${CONTACT}`} className={link}>
              {CONTACT}
            </a>
            .
          </p>

          <p className="mt-12 text-sm text-neutral-500">
            <Link href="/" className={link}>
              Back to the home page
            </Link>
          </p>
        </article>
      </Container>
    </SiteLayout>
  );
}
