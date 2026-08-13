import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container";
import { type } from "@/components/typography";

// Internal design-tool page — never ships to production. Guard mirrors the
// alphabeta-design audits pattern per Alfonso's `audits never deploy` rule.
export const dynamic = "force-dynamic";

const PHOTOS = [
  { src: "/images/pexels-17979558.jpg", alt: "Hero — man on balcony",       role: "Hero background" },
  { src: "/images/pexels-7787491.jpg",  alt: "Library — feet in shoes",     role: "Library featured" },
  { src: "/images/pexels-34806666.jpg", alt: "Editorial — man portrait",    role: "Why-it-matters" },
  { src: "/images/pexels-4909313.jpg",  alt: "Routine — nightly ritual",    role: "Routine card" },
  { src: "/images/pexels-11873696.jpg", alt: "Skin — bare feet",            role: "Topic thumbnail" },
];

// Duotone via SVG feColorMatrix — ink shadow + warm-cream highlight.
// Ink (#0F283D) → shadow; accent-100 (#FBEEEA) → highlight.
const DUOTONE_SVG = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="duotone-ink-warm">
        {/* Reduce to luminance first */}
        <feColorMatrix
          type="matrix"
          values="0.299 0.587 0.114 0 0
                  0.299 0.587 0.114 0 0
                  0.299 0.587 0.114 0 0
                  0     0     0     1 0"
        />
        {/* Map black→ink (#0F283D), white→accent-100 (#FBEEEA) */}
        <feComponentTransfer colorInterpolationFilters="sRGB">
          <feFuncR tableValues="0.06 0.98" />
          <feFuncG tableValues="0.16 0.93" />
          <feFuncB tableValues="0.24 0.92" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

const TREATMENTS = [
  {
    key: "grayscale",
    label: "Grayscale (current DS)",
    hint: "100% desaturated; unified but clinical",
    style: { filter: "grayscale(100%)" },
  },
  {
    key: "muted",
    label: "Muted LUT (~40% sat)",
    hint: "Retains skin-tone, adds warmth, harder to enforce",
    style: { filter: "saturate(40%) brightness(0.98) contrast(1.02)" },
  },
  {
    key: "duotone",
    label: "Duotone (ink + warm)",
    hint: "Systemic feel of grayscale + identity warmth",
    style: { filter: "url(#duotone-ink-warm)" },
  },
  {
    key: "color",
    label: "Full colour (baseline)",
    hint: "Reference only — not on the table",
    style: {},
  },
];

export default function ImageryTreatmentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-page text-ink">
      {DUOTONE_SVG}

      <Container>
        <div className="py-16 md:py-24">

          {/* ── Header ── */}
          <header className="max-w-3xl">
            <h1 className={`${type.h1} text-ink`}>
              Imagery treatments.
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-[1.5] text-neutral-600">
              Same five homepage photos, four treatments. Grayscale is the
              current DS rule. The other three are candidates for warmth
              without losing the systemic feel. Pick one and we amend the
              vault Foundations Imagery doc to match.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-[1.5] text-neutral-600">
              Look for: skin-tone integrity, consistency across mixed sources,
              distinctiveness vs generic wellness brands, and how each reads
              against ink surfaces (hero, footer) versus ground surfaces (cards).
            </p>
          </header>

          {/* ── Treatment column labels ── */}
          <div className="mt-16 grid grid-cols-4 gap-4">
            {TREATMENTS.map((t) => (
              <div key={t.key}>
                <p className="text-[0.9375rem] font-medium text-ink">{t.label}</p>
                <p className="mt-1 text-[0.75rem] leading-[1.5] text-neutral-500">
                  {t.hint}
                </p>
              </div>
            ))}
          </div>

          {/* ── 5 photos × 4 treatments grid ── */}
          <div className="mt-6 space-y-6">
            {PHOTOS.map((p) => (
              <div key={p.src}>
                <p className="mb-2 text-[0.75rem] font-medium text-neutral-500">
                  {p.role}
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {TREATMENTS.map((t) => (
                    <div
                      key={t.key}
                      className="relative aspect-[4/3] overflow-hidden bg-ink"
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        style={t.style}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Ink-surface reference ── */}
          <div className="mt-24">
            <h2 className={`${type.h2} text-ink`}>On the ink hero.</h2>
            <p className="mt-3 text-[0.9375rem] leading-[1.5] text-neutral-600">
              Same treatments applied to the hero photo, layered under the ink
              scrim exactly as the homepage renders it. Warmth reads different
              behind a dark overlay than it does bare.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {TREATMENTS.map((t) => (
                <div key={t.key}>
                  <p className="mb-2 text-[0.75rem] font-medium text-neutral-500">
                    {t.label}
                  </p>
                  <div className="relative aspect-[9/16] overflow-hidden bg-ink">
                    <Image
                      src={PHOTOS[0].src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      style={t.style}
                      className="object-cover"
                    />
                    {/* Same dual scrim as homepage */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <p className="font-heading text-xl font-medium leading-[1.1] text-white">
                        Your turn.<br />Start with<br />your feet.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Rationale + verdict slots ── */}
          <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className={`${type.h2} text-ink`}>The trade.</h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.5] text-neutral-600">
                Grayscale is the single most distinctive DS choice MSR has
                right now. Softening it puts the brand closer to every other
                wellness/health site. But grayscale flattens skin tones and
                can read clinical, which is the real complaint. The three
                candidates each trade a different slice of distinctiveness
                for warmth.
              </p>
              <ul className="mt-6 space-y-3 text-[0.9375rem] leading-[1.5] text-neutral-600">
                <li>
                  <strong className="text-ink">Muted LUT</strong> — one CSS
                  filter, portable, retains skin tone. Weakest DS coherence
                  because different source photos land at different color casts.
                </li>
                <li>
                  <strong className="text-ink">Duotone</strong> — SVG
                  <code className="mx-1 bg-neutral-100 px-1">feColorMatrix</code>
                  maps every image to ink + accent-100. Unified across sources,
                  identity warmth, closest to the systemic feel of grayscale.
                </li>
                <li>
                  <strong className="text-ink">Split treatment</strong> —
                  grayscale on authority moments (hero, why-it-matters, editorial),
                  muted or duotone on practical moments (routine tiles). Two
                  rules to enforce instead of one.
                </li>
              </ul>
            </div>

            <div>
              <h2 className={`${type.h2} text-ink`}>Reference brands.</h2>
              <ul className="mt-3 space-y-3 text-[0.9375rem] leading-[1.5] text-neutral-600">
                <li>
                  <strong className="text-ink">NYT, WSJ, FT weekend</strong> —
                  grayscale + duotone. Authority signal for 40+ readers.
                </li>
                <li>
                  <strong className="text-ink">MR PORTER Journal</strong> —
                  full-colour but heavily muted / cinematic LUTs.
                </li>
                <li>
                  <strong className="text-ink">Aesop, Byredo</strong> — either
                  duotone or muted colour, never saturated.
                </li>
                <li>
                  <strong className="text-ink">Cereal, Kinfolk</strong> —
                  muted with a preserved warm cast; brand-recognizable.
                </li>
                <li>
                  <strong className="text-ink">Huckberry</strong> — muted-colour
                  with occasional grayscale for editorial moments. Split treatment.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </Container>
    </main>
  );
}
