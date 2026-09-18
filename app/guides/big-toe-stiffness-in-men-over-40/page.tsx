"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["big-toe-stiffness-in-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: big toe
        // extension close-up, hand mobilizing big toe joint, bunion x-ray.
        heroSrc="/images/pexels-11873696.jpg"
        heroAlt="Barefoot big-toe extension during a mobility drill"
        title="Big Toe Stiffness in Men Over 40"
        category="Alignment"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="big-toe-stiffness-in-men-over-40" />
      <EcosystemFooter
        heading="What keeps the big toe moving."
        intro="The mobility protocol is the daily work. Toe separators slow drift. The alignment article covers the full kinetic chain the big toe controls."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
