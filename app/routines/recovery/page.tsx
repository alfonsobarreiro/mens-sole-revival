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
        heroSrc="/images/unsplash-cuOHHP5tx5g.jpg"
        heroAlt="A man seated on a porch, folded forward with his hands on his feet"
        title="The 6-Minute Recovery Routine"
        category="Recovery Routine"
        readTime="4 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="recovery" contentType="routine" />
      <EcosystemFooter
        heading="What this routine pairs with."
        intro="Release resets tight intrinsics but doesn't build them. Strength work three times a week is what actually makes the arch durable, and the arches article explains the differential diagnosis."
        routineKey="strength"
        articleSlugs={[
          "arches-hurt-after-walking",
          "plantar-fasciitis-exercises-for-men-over-40",
        ]}
        reviewSlugs={["superfeet-blue-insoles"]}
      />
    </SiteLayout>
  );
}
