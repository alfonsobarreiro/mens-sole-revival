"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["ball-of-foot-pain-in-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: bare foot at
        // rest after loading, close-up of forefoot / ball area, hands
        // adjusting an insole.
        heroSrc="/images/pexels-8729236.jpg"
        heroAlt="A bare foot resting on stone after loading, the ball of foot visible"
        title="Ball-of-Foot Pain in Men Over 40"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="ball-of-foot-pain-in-men-over-40" />
      <EcosystemFooter
        heading="What ball-of-foot pain responds to."
        intro="The fix stacks: wider toe box in your daily shoe, a correctly placed metatarsal pad, and short-term volume reduction. The dress-shoes guide is the parallel version of the fix for work footwear."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
