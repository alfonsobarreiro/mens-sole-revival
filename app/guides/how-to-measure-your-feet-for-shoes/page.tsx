"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["how-to-measure-your-feet-for-shoes"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-356175.jpg"
        heroAlt="A man's bare feet standing between two shoes"
        title="Measure Your Feet at Home"
        category="Footwear Fit"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="how-to-measure-your-feet-for-shoes" />
      <EcosystemFooter
        heading="Fit is the upstream variable."
        intro="Most of the problems on this site start with a shoe that doesn't match the foot. These cover what the wrong fit does and the two products we measured against it."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
