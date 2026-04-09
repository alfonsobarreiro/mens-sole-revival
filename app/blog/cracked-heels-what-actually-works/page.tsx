"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.pexels.com/photos/29145634/pexels-photo-29145634.jpeg?auto=compress&cs=tinysrgb&w=1400"
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
