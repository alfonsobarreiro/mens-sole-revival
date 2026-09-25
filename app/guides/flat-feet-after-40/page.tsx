"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["flat-feet-after-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with another guide); swap once the new photo is approved.
        heroSrc="/images/pexels-7205913.jpg"
        heroAlt="Barefoot walking, arch loaded"
        title="Flat Feet After 40"
        category="Alignment"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="flat-feet-after-40" />
      <EcosystemFooter
        heading="Support the arch, then load it."
        intro="A dropping arch changes what the knee and hip do. These guides cover the chain above, the arch itself, and the insole we tested."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
