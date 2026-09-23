"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["bunions-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-9616030.jpg"
        heroAlt="A man's bare feet resting on a windowsill"
        title="Bunions in Men Over 40"
        category="Alignment"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="bunions-men-over-40" />
      <EcosystemFooter
        heading="Slow the drift, keep the joint moving."
        intro="Toe spacers and a wide toe box change the load on the joint; the movement routine and the big-toe stiffness guide cover the range of motion that a bunion tends to steal."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
