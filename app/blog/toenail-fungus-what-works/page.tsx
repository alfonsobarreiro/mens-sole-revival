"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="https://images.pexels.com/photos/8980963/pexels-photo-8980963.jpeg?auto=compress&cs=tinysrgb&w=1400"
        heroAlt="Close-up of a man's foot — toenail fungus care guide"
        title="Toenail Fungus: What Actually Works (and What's a Scam)"
        category="Nail Care"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
    </SiteLayout>
  );
}
