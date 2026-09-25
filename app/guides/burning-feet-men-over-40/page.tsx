"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["burning-feet-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with another guide); swap once the new photo is approved.
        heroSrc="/images/pexels-13065922.jpg"
        heroAlt="A man walking barefoot along a road beside a field"
        title="Burning Feet"
        category="Foot Health"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="burning-feet-men-over-40" />
      <EcosystemFooter
        heading="Nerve, skin, or shoe."
        intro="Burning feet is a symptom shared by three different problems. These guides cover the nerve side, the skin side, and the daily check that catches both."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
