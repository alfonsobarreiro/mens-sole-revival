"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=1400&q=80"
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
