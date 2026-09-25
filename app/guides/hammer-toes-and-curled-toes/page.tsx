"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["hammer-toes-and-curled-toes"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with another guide); swap once the new photo is approved.
        heroSrc="/images/pexels-9616030.jpg"
        heroAlt="A man's bare feet resting on a windowsill"
        title="Hammer Toes and Curled Toes"
        category="Alignment"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="hammer-toes-and-curled-toes" />
      <EcosystemFooter
        heading="Toes bend for a reason."
        intro="Hammer toes travel with bunions, corns, and a narrow toe box. These guides cover each, plus the separator and the shoe we tested."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
