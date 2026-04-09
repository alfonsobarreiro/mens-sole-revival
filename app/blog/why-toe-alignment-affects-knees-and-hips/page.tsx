"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.pexels.com/photos/35206081/pexels-photo-35206081.jpeg?auto=compress&cs=tinysrgb&w=1400"
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
