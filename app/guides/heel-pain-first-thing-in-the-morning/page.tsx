"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["heel-pain-first-thing-in-the-morning"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Placeholder from
        // existing library so the route ships. Ideas: barefoot morning
        // in-bedroom shot, close-up of a heel, stretching foot at wake-up.
        heroSrc="/images/pexels-9467290.jpg"
        heroAlt="A man out of bed, taking the first steps of the morning"
        title="Heel Pain First Thing in the Morning: What It Means and How to Fix It"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="heel-pain-first-thing-in-the-morning" />
      <EcosystemFooter
        heading="What to do about it."
        intro="The morning-heel-pain pattern responds to a specific stretch protocol and, when it's stubborn, to changing what the tissue loads against overnight. Start with the morning routine below; the pillar guide explains why."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
