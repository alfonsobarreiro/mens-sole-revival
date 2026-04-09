"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.pexels.com/photos/9467290/pexels-photo-9467290.jpeg?auto=compress&cs=tinysrgb&w=1400"
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
