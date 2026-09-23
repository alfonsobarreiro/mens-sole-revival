"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["sprained-ankle-recovery-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-7298407.jpg"
        heroAlt="A man bent forward, holding his lower calf and ankle with both hands"
        title="Sprained Ankle After 40"
        category="Pain"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="sprained-ankle-recovery-over-40" />
      <EcosystemFooter
        heading="The strength work that keeps it from rolling again."
        intro="The strength routine has the balance and calf work a healed sprain needs. The Achilles and runner guides cover the two problems a bad sprain tends to leave behind."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
