"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import Article from "./article.mdx";

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-8637976.jpg"
        heroAlt="A gray-haired man in a runner's crouch on the beach, ready to load"
        title="The 5-Minute Strength Protocol"
        category="Strength Routine"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="strength" contentType="routine" />
      <EcosystemFooter
        heading="What strength pairs with."
        intro="Strength on its own progresses slowly. Combined with the morning stretch and the recovery release, it's what actually makes the foot durable at 40+. The exercises article breaks down the mechanics."
        routineKey="movement"
        articleSlugs={[
          "plantar-fasciitis-exercises-for-men-over-40",
          "big-toe-and-your-whole-body",
        ]}
        reviewSlugs={["yoga-toes-gem-separators"]}
      />
    </SiteLayout>
  );
}
