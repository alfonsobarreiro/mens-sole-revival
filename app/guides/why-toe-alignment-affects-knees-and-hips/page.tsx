"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["why-toe-alignment-affects-knees-and-hips"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-35206081.jpg"
        heroAlt="Man walking barefoot, toe alignment and its effect on knees and hips"
        title="Why Toe Alignment Affects Your Knees and Hips"
        category="Alignment"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="why-toe-alignment-affects-knees-and-hips" />
      <EcosystemFooter
        heading="Start the upstream fix."
        intro="The morning stretch is what gives you back motion. The toe spreader and a wider toe box are how you keep it."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
