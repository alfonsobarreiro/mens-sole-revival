"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["knee-pain-that-starts-in-the-feet"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: runner
        // stopped clutching knee, single-leg squat visible in mirror,
        // gait shot showing pronation.
        heroSrc="/images/pexels-34806666.jpg"
        heroAlt="An older man walking outdoors, showing his gait"
        title="Knee Pain That Starts in the Feet"
        category="Kinetic Chain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="knee-pain-that-starts-in-the-feet" />
      <EcosystemFooter
        heading="What unwinds the pronation chain."
        intro="Insole + stability shoe + foot and hip strengthening. The alignment article covers the full kinetic-chain map; the arches article covers the strengthening side in more depth."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
