"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=80"
        heroAlt="Man stretching barefoot — toe alignment and mobility"
        title="Your Big Toe Controls More of Your Body Than You Think"
        category="Toe Alignment"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
