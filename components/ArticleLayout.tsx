import type { ReactNode } from "react";
import Image from "next/image";
import { recipes } from "@/styles/recipes";
import { tokens } from "@/styles/tokens";

interface ArticleLayoutProps {
  children: ReactNode;
  heroSrc?: string;
  heroAlt?: string;
}

export default function ArticleLayout({
  children,
  heroSrc,
  heroAlt = "",
}: ArticleLayoutProps) {
  return (
    <div>
      {heroSrc && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className={`${tokens.layout.pageX} ${tokens.layout.pageY}`}>
        <article
          className={`${recipes.articleSurface} mx-auto ${tokens.layout.article}`}
        >
          {children}
        </article>
      </div>
    </div>
  );
}
