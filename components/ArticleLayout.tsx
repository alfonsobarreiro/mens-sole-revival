import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/Container";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";
import { Tag } from "@/components/ui/Tag";
import { type } from "@/components/typography";
import { recipes } from "@/styles/recipes";
import { tokens } from "@/styles/tokens";

// DS Foundations Layout — "one left rail":
// article prose lives INSIDE Container (max-w-6xl) and is LEFT-ALIGNED,
// never mx-auto-centered. This preserves a single left edge across the
// hero title, article body, GuideExtras, and EcosystemFooter — the
// horizontal grid rhythm the DS commits to.

interface ArticleLayoutProps {
  children: ReactNode;
  heroSrc?: string;
  heroAlt?: string;
  /** When provided, title is overlaid on the hero image in large display type */
  title?: string;
  category?: string;
  readTime?: string;
}

export default function ArticleLayout({
  children,
  heroSrc,
  heroAlt = "",
  title,
  category,
  readTime,
}: ArticleLayoutProps) {
  return (
    <div>
      {heroSrc && (
        <div className="relative flex h-[45vh] w-full flex-col overflow-hidden bg-ink">
          {/* Full-bleed hero image with muted-LUT (DS Foundations Imagery). */}
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            className="muted-photo object-cover object-center opacity-75"
            priority
          />

          {/* Dual scrim — DS text-on-photography rule (2026-08-13).
              Vertical grounds the base, horizontal keeps the title-column
              readable at the widest viewport. Min ink/20 everywhere text
              can sit. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/30" />

          {/* Text overlay — anchored bottom-left, DS-conformant type.
              Classes inlined (not composed from type.* / .eyebrow) so the
              baked-in colors don't override text-inverse — see DS
              Foundations Imagery → "Text on photography" token-cascade
              gotcha. */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Container>
                <div className="pb-12 md:pb-16 max-w-3xl">
                  <h1 className={`${type.displaySection} text-inverse`}>
                    {title}
                  </h1>
                  {(category || readTime) && (
                    <div className="mt-4 flex items-center gap-3">
                      {category && <Tag variant="on-photo">{category}</Tag>}
                      {readTime && (
                        <span className="text-xs font-medium tracking-[0.01em] text-inverse">
                          {readTime} read
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Container>
            </div>
          )}
        </div>
      )}

      <div className={tokens.layout.pageY}>
        <Container>
          <article
            className={`${recipes.articleSurface} ${tokens.layout.article} ${title ? "[&>h1:first-child]:hidden" : ""}`}
          >
            {children}
          </article>

          {/* End-of-article capture — highest-intent moment (they just
              finished reading). Same InlineNewsletterForm used on home and
              the exit popup, lead-magnet framing keeps the value exchange
              honest at every touch point. */}
          <div className={`mt-16 border-t border-neutral-200 pt-12 ${tokens.layout.article}`}>
            <InlineNewsletterForm />
          </div>
        </Container>
      </div>
    </div>
  );
}
