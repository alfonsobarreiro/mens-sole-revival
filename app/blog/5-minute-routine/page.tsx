"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["5-minute-routine"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-10904211.jpg"
        heroAlt="Man relaxing after a foot care routine — daily habit guide"
        title="A 5-Minute Daily Foot-Care Routine You Can Stick To"
        category="Daily Routine"
        readTime="4 min"
      >
        <Article />
      </ArticleLayout>
      <EcosystemFooter
        heading="The two products that make this work."
        intro="A good cream after the wash is the difference between dry and cracked. A powder before socks is the difference between fungus-prone and not."
        routineKey={rel.routine}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
