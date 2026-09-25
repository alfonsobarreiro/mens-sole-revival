"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["keeping-toenail-fungus-from-coming-back"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-oATODm0y5Aw.jpg"
        heroAlt="A pair of men's running shoes drying on a sunny step"
        title="Keeping Toenail Fungus From Coming Back"
        category="Nails"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="keeping-toenail-fungus-from-coming-back" />
      <EcosystemFooter
        heading="Prevention is a routine, not a product."
        intro="The nightly check and the weekly reset cover most of it. The skin guide and the fit guide cover the two usual routes back in."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
