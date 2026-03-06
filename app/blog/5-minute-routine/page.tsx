"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1400&q=80"
        heroAlt="Man relaxing after a foot care routine — daily habit guide"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
