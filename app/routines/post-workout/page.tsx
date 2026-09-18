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
        // TODO Alfonso: swap for a topic-matching hero. Ideas: runner
        // stretching post-run, foam roller on calf, hands on plantar fascia.
        heroSrc="/images/pexels-8729018.jpg"
        heroAlt="A man on a hill trail after a training session"
        title="The 8-Minute Post-Workout Routine"
        category="Recovery Routine"
        readTime="5 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="post-workout" contentType="routine" />
      <EcosystemFooter
        heading="What post-workout pairs with."
        intro="The 8 minutes after training shrinks the recovery window from days back to overnight. The morning stretch routine is the pre-training preparation. The runners-over-40 guide covers the mileage rules that keep the routine effective."
        routineKey="movement"
        articleSlugs={[
          "runners-over-40-foot-pain",
          "achilles-tendon-pain-in-men-over-40",
          "plantar-fasciitis-exercises-for-men-over-40",
        ]}
        reviewSlugs={["kuru-atom-sneakers", "superfeet-blue-insoles"]}
      />
    </SiteLayout>
  );
}
