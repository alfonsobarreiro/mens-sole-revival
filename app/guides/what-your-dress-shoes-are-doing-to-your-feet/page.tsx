"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["what-your-dress-shoes-are-doing-to-your-feet"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/pexels-12031206.jpg"
        heroAlt="Close-up of polished leather dress shoes"
        title="What 30 Years in Dress Shoes Actually Does to Your Feet"
        category="Footwear Fit"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <EcosystemFooter
        heading="What to do about it."
        intro="Most of the damage is reversible if you rebuild what the shoes shut down. A short strength routine, a smarter insole, and at least one pair of shoes built around foot anatomy."
        routineKey={rel.routine}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
