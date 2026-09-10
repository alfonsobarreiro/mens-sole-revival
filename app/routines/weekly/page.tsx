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
        heroSrc="/images/pexels-7047464.jpg"
        heroAlt="Bare feet on warm wood boards in afternoon light, a quiet at-home moment"
        title="The Sunday Foot Reset"
        category="Weekly Routine"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="weekly" contentType="routine" />
      <EcosystemFooter
        heading="What pairs with the weekly reset."
        intro="Weekly is the deep-clean layer. Daily is the every-night foundation, and the cracked-heels guide covers what to do when the maintenance layer has gotten behind."
        routineKey="daily"
        articleSlugs={[
          "cracked-heels-what-actually-works",
          "5-minute-routine",
        ]}
        reviewSlugs={["gehwol-fusskraft-soft-feet-cream", "gold-bond-medicated-foot-powder"]}
      />
    </SiteLayout>
  );
}
