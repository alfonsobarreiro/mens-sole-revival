"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["achilles-tendon-pain-in-men-over-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-17979558.jpg"
        heroAlt="An older man running on a dirt road, race bib on, calm effort"
        title="Achilles Tendon Pain in Men Over 40"
        category="Pain"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="achilles-tendon-pain-in-men-over-40" />
      <EcosystemFooter
        heading="What Achilles pain responds to."
        intro="The tendon quiets down with the eccentric heel-drop protocol. Morning calf and plantar stretching keeps the whole posterior chain from re-tightening overnight. And if you're not sure whether it's Achilles or plantar fasciitis, the heel-pain guide is the differential."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
