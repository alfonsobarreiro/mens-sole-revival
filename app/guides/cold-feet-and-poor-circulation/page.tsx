"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["cold-feet-and-poor-circulation"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-SUPbHp8VkMQ.jpg"
        heroAlt="A man in socks sitting on the floor with a book and a mug"
        title="Cold Feet and Poor Circulation"
        category="Foot Health"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="cold-feet-and-poor-circulation" />
      <EcosystemFooter
        heading="Circulation touches everything below the knee."
        intro="Cold feet share causes with numb feet and slow-healing skin. These guides cover the nerve side, the diabetic rules, and the nightly check."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
