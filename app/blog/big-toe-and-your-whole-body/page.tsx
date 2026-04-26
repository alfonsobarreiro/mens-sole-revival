"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-11873696.jpg"
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
