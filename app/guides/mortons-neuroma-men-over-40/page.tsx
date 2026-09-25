"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["mortons-neuroma-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with another guide); swap once the new photo is approved.
        heroSrc="/images/pexels-13122754.jpg"
        heroAlt="A man barefoot after a long day on his feet"
        title="Morton's Neuroma"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="mortons-neuroma-men-over-40" />
      <EcosystemFooter
        heading="Room for the forefoot."
        intro="A neuroma is a nerve with no room. These guides cover the other ball-of-foot causes, the numb-toe pattern, and the wide toe box that gives it space."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
