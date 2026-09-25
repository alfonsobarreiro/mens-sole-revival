"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["toenail-fungus-what-works"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-5960467.jpg"
        heroAlt="Close-up of a man's foot, toenail fungus care guide"
        title="Toenail Fungus: What Works, What's a Scam, and Where to Start"
        category="Nail Care"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="toenail-fungus-what-works" />
      <EcosystemFooter
        heading="Start with the right guide."
        intro="The self-check decides whether it's fungus, the comparison decides the route, and the protocol carries you through the year."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
