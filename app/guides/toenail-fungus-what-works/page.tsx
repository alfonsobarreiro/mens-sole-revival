"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["toenail-fungus-what-works"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-5960467.jpg"
        heroAlt="Close-up of a man's foot, toenail fungus care guide"
        title="Toenail Fungus: What Actually Works (and What's a Scam)"
        category="Nail Care"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="toenail-fungus-what-works" />
      <EcosystemFooter
        heading="The protocol, not just the product."
        intro="Recurrence kills most fungus treatments before they finish. Pair the antifungal with a twice-daily routine and a powder for the in-between."
        routineKey={rel.routine}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
