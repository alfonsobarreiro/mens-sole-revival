"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: hands drying
        // between toes, urea cream tube on counter, feet before bed.
        heroSrc="/images/unsplash-_w-v2QxDTrc.jpg"
        heroAlt="A man sitting on the edge of a bed, checking the sole of his own foot"
        title="The Nightly 5-Minute Checklist"
        category="Daily Routine"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="daily" contentType="routine" />
      <EcosystemFooter
        heading="What daily pairs with."
        intro="The 5 minutes nightly is the foundation. Weekly adds the deeper reset; the essay-format 5-minute-routine guide covers the mechanism behind each step."
        routineKey="weekly"
        articleSlugs={[
          "5-minute-routine",
          "cracked-heels-what-actually-works",
        ]}
        reviewSlugs={["gehwol-fusskraft-soft-feet-cream", "gold-bond-medicated-foot-powder"]}
      />
    </SiteLayout>
  );
}
