"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["heel-spurs-explained"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-pbHHfu95bBM.jpg"
        heroAlt="A man in a suit stretching his calf against a concrete wall"
        title="Heel Spurs"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="heel-spurs-explained" />
      <EcosystemFooter
        heading="Treat the fascia, not the spur."
        intro="The spur is the marker; the fascia and the calf are the treatment. These guides cover the morning heel pain, the exercises, and the Achilles side."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
