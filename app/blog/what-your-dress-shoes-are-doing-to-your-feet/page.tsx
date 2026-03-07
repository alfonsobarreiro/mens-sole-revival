"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1400&q=80"
        heroAlt="Close-up of polished leather dress shoes"
        title="What 30 Years in Dress Shoes Actually Does to Your Feet"
        category="Footwear Fit"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
