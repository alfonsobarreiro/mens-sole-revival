"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.pexels.com/photos/12031206/pexels-photo-12031206.jpeg?auto=compress&cs=tinysrgb&w=1400"
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
