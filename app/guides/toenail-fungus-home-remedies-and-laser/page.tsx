"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["toenail-fungus-home-remedies-and-laser"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-9376098.jpg"
        heroAlt="A man's hands filing a toenail with an emery board"
        title="Home Remedies and Laser for Toenail Fungus"
        category="Nails"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="toenail-fungus-home-remedies-and-laser" />
      <EcosystemFooter
        heading="The treatment with the odds is a prescription."
        intro="The comparison guide has the numbers. The self-check rules out the half of nails that were never fungal."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
