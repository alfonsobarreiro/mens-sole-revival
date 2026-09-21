import type { Metadata } from "next";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AskChat from "@/components/chat/AskChat";
import PreviewGallery from "@/components/chat/PreviewGallery";
import { askCopy } from "@/components/chat/copy";
import { previewSnapshot } from "@/components/chat/preview";
import { PREVIEW_STATES, type PreviewState } from "@/components/chat/types";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Ask a Foot Question",
  description:
    "Ask a question about foot pain, toenails, or foot care and get an answer drawn only from the Men's Sole Revival guides, with a link to each guide it used.",
  alternates: { canonical: "/ask" },
  // TODO(launch): remove noindex, add /ask to app/sitemap.ts and the site nav.
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// /ask: the guide-grounded assistant.
//
// Design review: outside production, /ask?state=<name> opens the page in any
// of its states, and /ask?state=gallery shows all of them. In production the
// search params are never read, so the page stays static.
// ─────────────────────────────────────────────────────────────────────────────

const previewEnabled = process.env.VERCEL_ENV !== "production";

function isPreviewState(value: unknown): value is PreviewState {
  return typeof value === "string" && (PREVIEW_STATES as readonly string[]).includes(value);
}

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string | string[] }>;
}) {
  const state = previewEnabled ? (await searchParams).state : undefined;

  return (
    <SiteLayout>
      <section className="bg-ink py-16 md:py-24">
        <Container>
          <h1 className={`${type.h1} text-inverse`}>{askCopy.hero.title}</h1>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.5] text-inverse-body">
            {askCopy.hero.body}
          </p>
        </Container>
      </section>

      <section className="bg-neutral-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            {state === "gallery" ? (
              <PreviewGallery />
            ) : isPreviewState(state) ? (
              <AskChat key={state} initial={previewSnapshot(state)} />
            ) : (
              <AskChat />
            )}
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
