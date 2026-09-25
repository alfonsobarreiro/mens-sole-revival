"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["toenail-fungus-treatments-compared"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-Zw4tbB4UfWI.jpg"
        heroAlt="A man's feet resting on a wooden dock, toenails in view"
        title="Toenail Fungus Treatments, Compared"
        category="Nails"
        readTime="9 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="toenail-fungus-treatments-compared" />
      <EcosystemFooter
        heading="Pick the route, then run the calendar."
        intro="Whatever you choose, the nail grows out over a year. The protocol, the self-check, and the prevention guide carry it."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
