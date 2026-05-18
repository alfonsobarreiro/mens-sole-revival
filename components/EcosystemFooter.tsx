import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { staticReviews } from "@/lib/reviews";
import { articles, routines, type RoutineRef } from "@/lib/ecosystem";

interface EcosystemFooterProps {
  /** Heading shown above the block. Defaults to "Continue with...". */
  heading?: string;
  /** Optional intro paragraph below the heading. */
  intro?: string;
  /** Article slugs to surface as cards. */
  articleSlugs?: string[];
  /** Review slugs to surface as cards. */
  reviewSlugs?: string[];
  /** Routine anchor key (matches keys in lib/ecosystem.ts → routines). */
  routineKey?: keyof typeof routines;
}

/**
 * Cross-links articles, reviews, and routines at the bottom of any
 * content page. The same block ships under articles, reviews, and
 * (eventually) the assessment results, so a man reading any one piece
 * sees the next two specific moves.
 */
export default function EcosystemFooter({
  heading = "Continue with...",
  intro,
  articleSlugs = [],
  reviewSlugs = [],
  routineKey,
}: EcosystemFooterProps) {
  const relatedArticles = articleSlugs
    .map((s) => articles[s])
    .filter(Boolean);

  const relatedReviews = reviewSlugs
    .map((s) => staticReviews.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const routine: RoutineRef | undefined = routineKey
    ? routines[routineKey]
    : undefined;

  const hasContent =
    relatedArticles.length > 0 || relatedReviews.length > 0 || routine;

  if (!hasContent) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-14 md:py-20">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
            Continue
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900 md:text-3xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-3 text-sm leading-6 text-neutral-600 md:text-base">
              {intro}
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Routine card */}
          {routine && (
            <Link
              href={`/routines#${routine.anchor}`}
              className="group flex flex-col border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
                Routine · {routine.label}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600">
                {routine.heading}
              </h3>
              <p className="mt-auto pt-5 text-xs font-semibold text-neutral-500">
                {routine.time}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-500 group-hover:text-brand-700">
                See the routine →
              </p>
            </Link>
          )}

          {/* Article cards */}
          {relatedArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/guides/${a.slug}`}
              className="group flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={a.imageUrl}
                  alt={a.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                  Guide · {a.category}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600">
                  {a.title}
                </h3>
                <p className="mt-auto pt-4 text-xs font-semibold text-neutral-400">
                  {a.readTime} read
                </p>
              </div>
            </Link>
          ))}

          {/* Review cards */}
          {relatedReviews.map((r) => (
            <Link
              key={r.slug}
              href={`/reviews/${r.slug}`}
              className="group flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {r.imageUrl && (
                  <Image
                    src={r.imageUrl}
                    alt={r.productName}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                  Reviewed · {r.brand}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600">
                  {r.productName}
                </h3>
                <p className="mt-auto pt-4 text-xs font-semibold text-neutral-400">
                  {r.rating != null ? `${r.rating}/10` : "See the verdict"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
