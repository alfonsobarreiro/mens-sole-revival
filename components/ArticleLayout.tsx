import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/Container";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";
import { type } from "@/components/typography";
import { recipes } from "@/styles/recipes";
import { tokens } from "@/styles/tokens";

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
          {/* Full-bleed hero image, grayscale per DS imagery rule */}
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            className="object-cover object-center opacity-75 grayscale"
            priority
          />

          {/* Bottom-weighted scrim so the title stays readable while the top of
              the image still breathes. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

          {/* Text overlay — anchored bottom-left, DS-conformant type */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Container>
                <div className="pb-10 md:pb-14 max-w-3xl">
                  {(category || readTime) && (
                    <p className="eyebrow mb-4 !text-white/85">
                      {[category, readTime && `${readTime} read`].filter(Boolean).join("  ·  ")}
                    </p>
                  )}
                  <h1 className={`${type.displaySection} text-white leading-tight`}>
                    {title}
                  </h1>
                </div>
              </Container>
            </div>
          )}
        </div>
      )}

      <div className={`${tokens.layout.pageX} ${tokens.layout.pageY}`}>
        <article
          className={`${recipes.articleSurface} mx-auto ${tokens.layout.article} ${title ? "[&>h1:first-child]:hidden" : ""}`}
        >
          {children}
        </article>

        {/* End-of-article capture — highest-intent moment (they just
            finished reading). Same InlineNewsletterForm used on home and
            the exit popup, lead-magnet framing keeps the value exchange
            honest at every touch point. */}
        <div className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-12">
          <InlineNewsletterForm />
        </div>
      </div>
    </div>
  );
}
