import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { type } from "@/components/typography";
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
 * content page. Same block ships under articles, reviews, and (eventually)
 * assessment results — so DS conformance here cascades to every content
 * page on the site.
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
    <section className="border-t border-neutral-200 bg-neutral-100 py-16 md:py-24">
      <Container>
        {/* Header — DS "one left rail" (max-w-2xl left-aligned, no mx-auto). */}
        <div className="mb-8 max-w-2xl">
          {/* Inline classes so the baked-in text-neutral-500 in type.overline
              doesn't override text-accent-700 — DS token-cascade gotcha. */}
          <p className="text-xs font-medium tracking-[0.01em] text-accent-700">
            Continue
          </p>
          <h2 className={`mt-2 ${type.h2} text-ink`}>{heading}</h2>
          {intro && (
            <p className={`mt-3 ${type.lead} text-neutral-600`}>{intro}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Routine card */}
          {routine && (
            <Link
              href={`/routines#${routine.anchor}`}
              className="group block transition"
            >
              <Card
                variant="elevated"
                className="flex h-full flex-col p-6 transition group-hover:border-ink"
              >
                <Tag variant="accent-kicker" className="self-start !px-0">
                  Routine · {routine.label}
                </Tag>
                <h3
                  className={`mt-3 ${type.h3} text-ink transition group-hover:text-accent-700`}
                >
                  {routine.heading}
                </h3>
                <p className={`mt-auto pt-6 ${type.small} text-neutral-500`}>
                  {routine.time}
                </p>
                <p className="mt-3 text-xs font-medium tracking-[0.01em] text-accent-700 transition group-hover:underline underline-offset-4">
                  See the routine →
                </p>
              </Card>
            </Link>
          )}

          {/* Article cards */}
          {relatedArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/guides/${a.slug}`}
              className="group block transition"
            >
              <Card
                variant="elevated"
                className="flex h-full flex-col overflow-hidden transition group-hover:border-ink"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="muted-photo object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Tag variant="accent-kicker" className="self-start !px-0">
                    Guide · {a.category}
                  </Tag>
                  <h3
                    className={`mt-2 ${type.h3} text-ink transition group-hover:text-accent-700`}
                  >
                    {a.title}
                  </h3>
                  <p className={`mt-auto pt-4 ${type.small} text-neutral-500`}>
                    {a.readTime} read
                  </p>
                </div>
              </Card>
            </Link>
          ))}

          {/* Review cards */}
          {relatedReviews.map((r) => (
            <Link
              key={r.slug}
              href={`/reviews/${r.slug}`}
              className="group block transition"
            >
              <Card
                variant="elevated"
                className="flex h-full flex-col overflow-hidden transition group-hover:border-ink"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {r.imageUrl && (
                    <Image
                      src={r.imageUrl}
                      alt={r.productName}
                      fill
                      className="muted-photo object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Tag variant="accent-kicker" className="self-start !px-0">
                    Reviewed · {r.brand}
                  </Tag>
                  <h3
                    className={`mt-2 ${type.h3} text-ink transition group-hover:text-accent-700`}
                  >
                    {r.productName}
                  </h3>
                  <p className={`mt-auto pt-4 ${type.small} text-neutral-500`}>
                    {r.rating != null ? `${r.rating}/10` : "See the verdict"}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
