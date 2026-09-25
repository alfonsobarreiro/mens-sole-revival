"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["black-toenail-what-it-means"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        // TODO Alfonso: placeholder hero (shared with another guide); swap once the new photo is approved.
        heroSrc="/images/pexels-5036256.jpg"
        heroAlt="Three men sitting barefoot on a patterned rug"
        title="Black Toenail"
        category="Nails"
        readTime="7 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="black-toenail-what-it-means" />
      <EcosystemFooter
        heading="The rest of the nail cluster."
        intro="A dark nail is usually a bruise and occasionally not. These cover fungus, the shoe-length fix for runners, and the trim that keeps corners out of the skin."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
