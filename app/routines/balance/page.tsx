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
        heroSrc="/images/pexels-6975771.jpg"
        heroAlt="A gray-bearded man standing on one leg in his living room, one knee raised and one arm out for balance"
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
