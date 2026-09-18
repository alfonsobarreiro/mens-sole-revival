"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["runners-over-40-foot-pain"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: older
        // runner mid-stride, feet in running shoes on trail, laces of
        // trainers being tightened.
        heroSrc="/images/pexels-33360918.jpg"
        heroAlt="A runner outdoors during a training session"
        title="Runners Over 40: Foot Pain That Wasn't There at 30"
        category="Pain"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="runners-over-40-foot-pain" />
      <EcosystemFooter
        heading="What keeps you running past 50."
        intro="Mileage rule + shoe rules + two routines (morning stretch, post-workout recovery). The Achilles and PF exercises articles cover the two most common patterns to master first."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
