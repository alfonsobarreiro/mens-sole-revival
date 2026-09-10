"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["arches-hurt-after-walking"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Placeholder used.
        // Ideas: side profile of foot arch, hiking boots at end of day,
        // walking barefoot on beach at low angle.
        heroSrc="/images/pexels-7205913.jpg"
        heroAlt="Barefoot walking, arch loaded"
        title="Why Your Arches Hurt After Walking (And How to Strengthen Them)"
        category="Pain"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="arches-hurt-after-walking" />
      <EcosystemFooter
        heading="Load the arch on purpose."
        intro="Arch pain that shows up only after walking usually traces to weak intrinsics under-supporting a fine structure. The strength routine below fixes it in weeks."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
