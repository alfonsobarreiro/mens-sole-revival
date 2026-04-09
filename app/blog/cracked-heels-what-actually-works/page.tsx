"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-29145634.jpg"
        heroAlt="Man applying lotion to dry skin — cracked heel care"
        title="Cracked Heels: The Fix That Isn't a Pumice Stone"
        category="Dry Skin"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
