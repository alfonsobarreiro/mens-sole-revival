"use client";

import SiteLayout from "@/components/SiteLayout";
import ArticleLayout from "@/components/ArticleLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import GuideExtras from "@/components/GuideExtras";
import { articleRelations } from "@/lib/ecosystem";
import Article from "./article.mdx";

const rel = articleRelations["toenail-fungus-12-month-protocol"];

export default function Page() {
  return (
    <SiteLayout>
      <ArticleLayout
        heroSrc="/images/unsplash-UrFkjQkLs6I.jpg"
        heroAlt="A man trimming his toenails, seated on the edge of a bath"
        title="The 12-Month Toenail Fungus Protocol"
        category="Nails"
        readTime="8 min"
      >
        <Article />
      </ArticleLayout>
      <GuideExtras slug="toenail-fungus-12-month-protocol" />
      <EcosystemFooter
        heading="The daily part lives in the routines."
        intro="Drying, checking, and trimming are already in the nightly and weekly routines. The treatment guide and the prevention guide are the rest of the year."
        routineKey={rel.routine}
        articleSlugs={rel.relatedArticles}
        reviewSlugs={rel.reviews}
      />
    </SiteLayout>
  );
}
