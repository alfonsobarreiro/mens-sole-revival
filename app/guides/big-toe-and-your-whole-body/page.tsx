"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["big-toe-and-your-whole-body"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-11873696.jpg"
        heroAlt="Man stretching barefoot, toe alignment and mobility"
        title="Your Big Toe Controls More of Your Body Than You Think"
        category="Toe Alignment"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="big-toe-and-your-whole-body" />
      <EcosystemFooter
        heading="The two ways to give it back."
        intro="A daily strength habit is the slow fix. A toe spreader is the assist while you build it. Footwear that doesn't crush is the third leg of the stool."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
