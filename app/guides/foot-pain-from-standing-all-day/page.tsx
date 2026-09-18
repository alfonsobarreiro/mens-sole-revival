"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["foot-pain-from-standing-all-day"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: retail
        // worker on feet, kitchen prep line, teacher standing at board.
        heroSrc="/images/pexels-13122754.jpg"
        heroAlt="A man barefoot after a long day on his feet"
        title="Foot Pain from Standing All Day"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="foot-pain-from-standing-all-day" />
      <EcosystemFooter
        heading="What ends the end-of-shift ache."
        intro="Shoe fit + insole + on-shift micro-breaks + post-shift recovery. The recovery routine is the after-shift piece; the dress-shoes guide covers the fit rules if your work shoe is locked by dress code."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
