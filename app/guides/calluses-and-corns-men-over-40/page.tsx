"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["calluses-and-corns-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-15098712.jpg"
        heroAlt="A worn shoe sole seen from behind as a man steps forward"
        title="Calluses and Corns"
        category="Skin"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="calluses-and-corns-men-over-40" />
      <EcosystemFooter
        heading="Fix the pressure, then the skin."
        intro="Cracked heels and ball-of-foot pain share the same root as most calluses: load in the wrong place. The weekly routine keeps the skin in check once the pressure is handled."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
