"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["athletes-foot-and-foot-odor-what-works"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-7312082.jpg"
        heroAlt="A bare foot with sand on the toes, resting on a wet rock"
        title="Athlete's Foot and Foot Odor"
        category="Skin"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="athletes-foot-and-foot-odor-what-works" />
      <EcosystemFooter
        heading="The two products and the routine that keep it gone."
        intro="An antifungal cream, a drying powder, and the daily routine that keeps shoes dry. The toenail fungus guide covers what happens when it reaches the nail."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
