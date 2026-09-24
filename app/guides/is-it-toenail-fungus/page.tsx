"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["is-it-toenail-fungus"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with the fungus guide); swap once the new photo is approved.
        heroSrc="/images/pexels-5960467.jpg"
        heroAlt="A man's bare feet on a wooden floor, big toes in focus"
        title="Is It Toenail Fungus?"
        category="Nails"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="is-it-toenail-fungus" />
      <EcosystemFooter
        heading="Get the answer before the year of treatment."
        intro="The clipping test decides the route. These cover the skin, the nightly check, and what to bring to the visit."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
