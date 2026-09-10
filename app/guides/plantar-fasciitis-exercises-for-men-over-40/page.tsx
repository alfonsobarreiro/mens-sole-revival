"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["plantar-fasciitis-exercises-for-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Placeholder used
        // so route ships. Ideas: hands wrapping foot mid-stretch, calf
        // stretch on stairs, single-leg raise silhouette.
        heroSrc="/images/pexels-4909313.jpg"
        heroAlt="A man doing a calf and plantar stretch after wakeup"
        title="Plantar Fasciitis Exercises for Men Over 40: What Actually Works"
        category="Pain"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="plantar-fasciitis-exercises-for-men-over-40" />
      <EcosystemFooter
        heading="Do the routine."
        intro="Every exercise below feeds the same tissue adaptation. The daily short-form routine on /routines is the delivery vehicle."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
