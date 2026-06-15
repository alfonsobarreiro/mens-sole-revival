import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

// Transactional landing — keep it out of search.
export const metadata: Metadata = {
  title: "Subscription confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status !== "invalid";

  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            {ok ? (
              <>
                <p className={type.overline}>Confirmed</p>
                <h1 className={`mt-3 ${type.h1}`}>You're in.</h1>
                <p className={`mt-6 ${type.lead}`}>
                  Your subscription is confirmed. New guides, reviews, and
                  routines for men over 40 are headed to your inbox — plus the
                  occasional practical tip. You can unsubscribe anytime.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/guides"
                    className="inline-block bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    Browse the guides
                  </Link>
                  <Link
                    href="/assessment"
                    className="inline-block border border-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
                  >
                    Take the assessment
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className={type.overline}>Link problem</p>
                <h1 className={`mt-3 ${type.h1}`}>This link didn't work.</h1>
                <p className={`mt-6 ${type.lead}`}>
                  Your confirmation link is invalid or has expired (links last 48
                  hours). No problem — subscribe again and we'll send a fresh one.
                </p>
                <div className="mt-8">
                  <Link
                    href="/newsletter"
                    className="inline-block bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    Subscribe again
                  </Link>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
