"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["diabetic-foot-care-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero.
        heroSrc="/images/pexels-8637976.jpg"
        heroAlt="A gray-haired man kneeling on a beach in running gear"
        title="Diabetic Foot Care"
        category="Foot Health"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="diabetic-foot-care-men-over-40" />
      <EcosystemFooter
        heading="The routine and the skin care that go with the daily check."
        intro="The daily routine is where the 60-second check lives. Cracked heels and fungal nails matter more with diabetes because each one is a door for infection."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
