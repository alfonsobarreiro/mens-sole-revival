"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["numbness-and-tingling-in-the-feet"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-13065922.jpg"
        heroAlt="A man walking barefoot along a road beside a field"
        title="Numbness and Tingling in the Feet"
        category="Foot Health"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="numbness-and-tingling-in-the-feet" />
      <EcosystemFooter
        heading="If it's the shoe or the nerve in the forefoot, start here."
        intro="Ball-of-foot pain and dress-shoe compression cover the two mechanical causes; the movement routine keeps the ankle and forefoot moving while you sort out which one you have."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
