"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["foot-and-calf-cramps-at-night"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-7298421.jpg"
        heroAlt="A man pressing his thumbs into a tight calf muscle after a run"
        title="Foot and Calf Cramps at Night"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="foot-and-calf-cramps-at-night" />
      <EcosystemFooter
        heading="The stretches that cut the 2 a.m. cramp."
        intro="The recovery routine has the calf and sole work; the plantar fasciitis guide explains why a tight calf shows up as foot pain by day and a cramp by night."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
