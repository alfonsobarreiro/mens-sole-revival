import Container from "@/components/Container";
import { guideSeo } from "@/lib/guide-seo";

/**
 * Visible "Common questions" + "Sources" block rendered at the foot of every
 * guide. The FAQ and source data come from lib/guide-seo.ts — the SAME data the
 * FAQPage/Article JSON-LD is built from — so the structured data always matches
 * what's on the page. Renders nothing if the slug has no SEO entry.
 */
export default function GuideExtras({ slug }: { slug: string }) {
  const seo = guideSeo[slug];
  if (!seo) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-100 py-12 md:py-16">
      <Container>
        {/* DS "one left rail" — max-w-2xl left-aligned inside Container. */}
        <div className="max-w-2xl">
          {/* Common questions */}
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
            Common questions
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900">
            Quick answers.
          </h2>
          <dl className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
            {seo.faq.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-sm font-bold leading-6 text-brand-900">
                  {f.q}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-neutral-600">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>

          {/* Sources */}
          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Sources
            </p>
            <ul className="mt-3 space-y-1.5">
              {seo.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-neutral-400">
              Educational information, not a medical diagnosis. See a podiatrist
              for persistent or severe symptoms.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
