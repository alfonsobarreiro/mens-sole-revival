import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Check-ins stopped",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const linkClass = "text-brand-600 underline underline-offset-4 hover:text-brand-900";

export default async function CheckInsStoppedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status === "ok";

  return (
    <SiteLayout>
      <Container>
        <div className="max-w-2xl py-16 md:py-24">
          {ok ? (
            <>
              <p className={type.overline}>Check-ins</p>
              <h1 className={`mt-3 ${type.h1}`}>Check-ins stopped.</h1>
              <p className={`mt-6 ${type.lead}`}>
                No more 30-day or 90-day emails for this address. Your results stay where they
                were, and you can still open your progress any time.
              </p>
              <p className="mt-8 text-sm text-neutral-500">
                Changed your mind? Take the assessment again and tick the check-in box, and the
                clock starts fresh.{" "}
                <Link href="/assessment" className={linkClass}>
                  Take the assessment →
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className={type.overline}>Link problem</p>
              <h1 className={`mt-3 ${type.h1}`}>This link didn&apos;t work.</h1>
              <p className={`mt-6 ${type.lead}`}>
                {status === "error"
                  ? "We couldn't update your check-ins just now. Try the link again in a moment."
                  : "The link is incomplete or was changed along the way. Use the one in your check-in email, or open your progress and go from there."}
              </p>
              <p className="mt-8 text-sm text-neutral-500">
                <Link href="/progress" className={linkClass}>
                  See your progress →
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </SiteLayout>
  );
}
