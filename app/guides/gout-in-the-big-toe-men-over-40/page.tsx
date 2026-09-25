"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["gout-in-the-big-toe-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-8728672.jpg"
        heroAlt="A man holding the toes of his bare foot"
        title="Gout in the Big Toe"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="gout-in-the-big-toe-men-over-40" />
      <EcosystemFooter
        heading="What to do while you wait for the appointment."
        intro="Gout is a doctor's diagnosis, but shoes, the movement routine, and the stiffness guide cover the days around it."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
