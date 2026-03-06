"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1608138278598-7e595958dbe0?w=1400&q=80"
        heroAlt="Close-up of a man's foot — toenail fungus care guide"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
