import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/Container";
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
        <div className="relative flex min-h-[55vh] w-full flex-col overflow-hidden bg-brand-900">
          {/* Full-bleed hero image */}
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            className="object-cover object-center opacity-60"
            priority
          />

          {/* Gradient — bottom-heavy so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-brand-900/10" />

          {/* Text overlay — anchored to bottom-left */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Container>
                <div className="pb-10 md:pb-14 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {category && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {category}
                      </span>
                    )}
                    {readTime && (
                      <span className="text-xs text-brand-300">{readTime} read</span>
                    )}
                  </div>
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
      </div>
    </div>
  );
}
