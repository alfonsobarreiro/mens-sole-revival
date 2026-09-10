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
        heroSrc="/images/pexels-3771071.jpg"
        heroAlt="A man seated on the ground reaching for his toe in a morning stretch"
        title="The Plantar Stretch Sequence"
        category="Movement Routine"
        readTime="4 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="movement" contentType="routine" />
      <EcosystemFooter
        heading="What pairs with the morning stretch."
        intro="The stretch clears morning pain. Strength work three times a week keeps it from coming back. And if the arches are the specific tissue that's tight, the recovery routine releases the intrinsics that share load with the fascia."
        routineKey="strength"
        articleSlugs={[
          "heel-pain-first-thing-in-the-morning",
          "plantar-fasciitis-exercises-for-men-over-40",
        ]}
        reviewSlugs={["superfeet-blue-insoles"]}
      />
    </SiteLayout>
  );
}
