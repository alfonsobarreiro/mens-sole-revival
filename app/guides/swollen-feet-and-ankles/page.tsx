"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["swollen-feet-and-ankles"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-6863766.jpg"
        heroAlt="A man lying on a sofa with his feet up on the armrest"
        title="Swollen Feet and Ankles"
        category="Foot Health"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="swollen-feet-and-ankles" />
      <EcosystemFooter
        heading="Find the cause before the fix."
        intro="Swelling is a symptom with a dozen causes. These guides cover the neighbors: standing all day, numb feet, and the diabetic rules."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
