"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&q=80"
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
