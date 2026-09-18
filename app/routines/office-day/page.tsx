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
        // TODO Alfonso: swap for a topic-matching hero. Ideas: man at desk
        // (feet visible), calf pump under desk, ankle circles at chair.
        heroSrc="/images/pexels-15098712.jpg"
        heroAlt="A dress shoe caught mid-step during a workday"
        title="Desk Micro-Routines"
        category="Office-Day Routine"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="office-day" contentType="routine" />
      <EcosystemFooter
        heading="What office-day pairs with."
        intro="Micro-moves during the day prevent stiffness accumulation. The daily nightly checklist keeps skin and nails healthy. The standing-all-day guide covers the on-shift version if your job flipped from sitting to standing."
        routineKey="daily"
        articleSlugs={[
          "foot-pain-from-standing-all-day",
          "what-your-dress-shoes-are-doing-to-your-feet",
        ]}
        reviewSlugs={["kuru-atom-sneakers", "superfeet-blue-insoles"]}
      />
    </SiteLayout>
  );
}
