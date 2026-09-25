"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["pain-on-top-of-the-foot"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-rP-9W__umN0.jpg"
        heroAlt="A man tying a running shoe, close up on the laces"
        title="Pain on Top of the Foot"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="pain-on-top-of-the-foot" />
      <EcosystemFooter
        heading="The neighbors of top-of-foot pain."
        intro="The same shoes and mileage that inflame the top of the foot cause the problems next door. These cover the ball of the foot, the runner's foot, and the numb-toe pattern."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
