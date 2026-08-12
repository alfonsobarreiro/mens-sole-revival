"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["cracked-heels-what-actually-works"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-29145634.jpg"
        heroAlt="Man applying lotion to dry skin, cracked heel care"
        title="Cracked Heels: The Fix That Isn't a Pumice Stone"
        category="Dry Skin"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="cracked-heels-what-actually-works" />
      <EcosystemFooter
        heading="Now do the thing."
        intro="The fix is a short nightly habit and the right cream. Here's the routine that takes five minutes, and the product that works."
        routineKey={rel.routine}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
