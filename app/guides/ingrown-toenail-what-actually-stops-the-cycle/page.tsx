"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["ingrown-toenail-what-actually-stops-the-cycle"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: swap for a topic-matching hero. Ideas: nail clipper
        // on toe, close-up of a straight-across trim, before/after edge.
        heroSrc="/images/pexels-5960467.jpg"
        heroAlt="Close-up of a toenail edge before trim"
        title="Ingrown Toenail: What Actually Stops the Cycle"
        category="Nails"
        readTime="6 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="ingrown-toenail-what-actually-stops-the-cycle" />
      <EcosystemFooter
        heading="What ends the cycle."
        intro="Straight-across trim technique is the mechanism-level fix. The daily nightly checklist catches the next one at day 2, and the toenail-fungus guide covers the other most common nail issue after 40."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
