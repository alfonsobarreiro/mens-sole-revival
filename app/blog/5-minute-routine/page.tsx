"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-10904211.jpg"
        heroAlt="Man relaxing after a foot care routine — daily habit guide"
        title="A 5-Minute Daily Foot-Care Routine You Can Stick To"
        category="Daily Routine"
        readTime="4 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
