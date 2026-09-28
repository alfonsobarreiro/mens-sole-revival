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
        heroSrc="/images/pexels-8700843.jpg"
        heroAlt="A man holding a lunge on grass, front knee bent, rear leg long"
        title="The 10-Minute Balance Routine"
        category="Balance Routine"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="balance" contentType="routine" />
      <EcosystemFooter
        heading="What balance pairs with."
        intro="Balance work covers one side of fall prevention. Leg and foot strength covers the other, and numbness in the feet changes what's safe to try on your own."
        routineKey="strength"
        articleSlugs={[
          "numbness-and-tingling-in-the-feet",
          "sprained-ankle-recovery-over-40",
        ]}
      />
    </SiteLayout>
  );
}
