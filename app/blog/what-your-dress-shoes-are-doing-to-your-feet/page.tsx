"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-12031206.jpg"
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
