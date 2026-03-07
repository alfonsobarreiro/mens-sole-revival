"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80"
        heroAlt="Man walking barefoot — toe alignment and its effect on knees and hips"
        title="Why Toe Alignment Affects Your Knees and Hips"
        category="Alignment"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
