"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-8980963.jpg"
        heroAlt="Close-up of a man's foot — toenail fungus care guide"
        title="Toenail Fungus: What Actually Works (and What's a Scam)"
        category="Nail Care"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
