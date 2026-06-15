"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["why-your-feet-hurt-after-40"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-7787491.jpg"
        heroAlt="An older man hiking outdoors — staying active after 40"
        title="Why Your Feet Hurt After 40 (and What's Actually Going On)"
        category="Foot Health"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="why-your-feet-hurt-after-40" />
      <EcosystemFooter
        heading="Find your starting point."
        intro="The pain traces to one pattern more than the others. The 5-minute self-check tells you which — then points you to the routine and the guide that fit it."
        routineKey={rel.routine}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
