"use client";

/**
 * /homepage-2 — Rejected Direction: Clinical / Health Advisory Palette
 *
 * Case study artifact for Men's Sole Revival.
 * All sections match the real homepage — same content, same structure —
 * rendered in the clinical direction that was evaluated and rejected.
 *
 * Intentionally isolated from the MSR brand system:
 * no SiteLayout, no brand tokens, no Tailwind brand utilities.
 * Uses its own inline style tokens only.
 *
 * noindex: set in layout.tsx
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Clinical palette — NOT from MSR brand system ───────────────────────────
const c = {
  bg:          "#F8FAFC",
  bgSubtle:    "#EFF6FF",
  bgInfo:      "#DBEAFE",
  surface:     "#FFFFFF",
  primary:     "#1E3A5F",
  primaryMid:  "#2563EB",
  primaryLight:"#3B82F6",
  accent:      "#0EA5E9",
  health:      "#10B981",
  healthLight: "#D1FAE5",
  warn:        "#F59E0B",
  text:        "#374151",
  textMuted:   "#6B7280",
  textLight:   "#9CA3AF",
  border:      "#E2E8F0",
  borderStrong:"#CBD5E1",
};

const heading = "var(--font-clinical-heading, 'Merriweather', Georgia, serif)";
const body    = "var(--font-clinical-body, 'Inter', system-ui, sans-serif)";

// ── Data (mirrors homepage) ────────────────────────────────────────────────

const kits = [
  {
    title: "Pain & Recovery Protocol",
    tag: "Most prescribed",
    desc: "Addresses plantar fasciitis, Achilles tendinopathy, and metatarsalgia. Combines load management principles with evidence-based stretching and targeted footwear guidance.",
    href: "/waitlist?kit=pain-recovery",
  },
  {
    title: "Onychomycosis Management",
    tag: "Long-term treatment",
    desc: "Tinea unguium (toenail fungus) affects an estimated 10–14% of the general population, with prevalence increasing with age. Protocol includes antifungal application cadence and hygiene standards.",
    href: "/waitlist?kit=fungus-care",
  },
  {
    title: "Toe Alignment & Mobility",
    tag: "Structural correction",
    desc: "Hallux valgus and lesser toe deformity are associated with decades of constrictive footwear. Passive and active mobilization exercises alongside toe spacer protocols.",
    href: "/waitlist?kit=alignment-mobility",
  },
];

const articles = [
  {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "Cumulative Footwear Stress: What 30 Years of Dress Shoes Does to Foot Mechanics",
    category: "Footwear Fit",
    readTime: "7 min",
    excerpt: "Research in podiatric biomechanics shows a direct correlation between prolonged use of narrow toe-box shoes and progressive forefoot deformity. A clinical overview.",
    image: "/images/pexels-12031206.jpg",
  },
  {
    slug: "big-toe-and-your-whole-body",
    title: "First Ray Function: The Clinical Role of the Hallux in Lower Limb Kinetics",
    category: "Toe Alignment",
    readTime: "6 min",
    excerpt: "The hallux contributes 40–60% of propulsive force during terminal stance. Hallux limitus and rigidus have measurable downstream effects on knee and hip loading patterns.",
    image: "/images/pexels-11873696.jpg",
  },
  {
    slug: "cracked-heels-what-actually-works",
    title: "Xerosis and Heel Fissure Management: Evidence-Based Treatment Protocols",
    category: "Dermatology",
    readTime: "5 min",
    excerpt: "Mechanical debridement alone is insufficient for chronic heel fissures. Current dermatological guidance recommends urea-based emollients (20–40%) as first-line treatment.",
    image: "/images/pexels-29145634.jpg",
  },
  {
    slug: "toenail-fungus-what-works",
    title: "Onychomycosis: Comparative Efficacy of OTC vs. Prescription Treatment Options",
    category: "Nail Care",
    readTime: "8 min",
    excerpt: "Systematic reviews indicate oral terbinafine achieves 76% mycological cure rates vs. 22% for topical ciclopirox. A clinical comparison of available treatment modalities.",
    image: "/images/pexels-5960467.jpg",
  },
  {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Kinetic Chain Implications of Hallux Restriction: Knee, Hip, and Lumbar Effects",
    category: "Biomechanics",
    readTime: "5 min",
    excerpt: "Restricted hallux dorsiflexion during terminal stance produces compensatory pronation and internal tibial rotation, with documented effects at the patellofemoral joint.",
    image: "/images/pexels-35206081.jpg",
  },
];

const stats = [
  {
    value: "1 in 4",
    label: "men over 40 experience chronic foot pain",
    context: "That's probably someone in your household.",
  },
  {
    value: "75%",
    label: "of foot problems are preventable with consistent care",
    context: "Most of what slows men down after 40 was preventable.",
  },
];

const topics = [
  {
    label: "Pain & Recovery",
    href: "/waitlist?kit=pain-recovery",
    image: "/images/pexels-5960467.jpg",
    tagline: "Your body is sending a signal.",
    description: "Plantar fasciitis, heel spurs, arch strain — foot pain rarely disappears on its own. Learn how to identify the source, reduce inflammation, and build resilience.",
  },
  {
    label: "Nail Care",
    href: "/waitlist?kit=fungus-care",
    image: "/images/pexels-35206081.jpg",
    tagline: "Small details, big confidence.",
    description: "Thick, discolored, or ingrown nails are more common than you think — and more treatable. A consistent protocol can restore clean, healthy nails in weeks.",
  },
  {
    label: "Toe Alignment",
    href: "/waitlist?kit=alignment-mobility",
    image: "/images/pexels-10904211.jpg",
    tagline: "Your toes set the foundation.",
    description: "Bunions, hammer toes, and crowded toe boxes trace back to how your foot contacts the ground. Simple daily exercises and footwear awareness can reverse years of drift.",
  },
  {
    label: "Daily Routine",
    href: "/blog/5-minute-routine",
    image: "/images/pexels-13122754.jpg",
    tagline: "Five minutes. Every day.",
    description: "The men who take care of their feet do it consistently — not occasionally. A simple washing, drying, and moisturizing habit prevents 90% of common foot problems.",
  },
  {
    label: "Footwear Fit",
    href: "/waitlist?kit=footwear-fit",
    image: "/images/pexels-8729236.jpg",
    tagline: "The wrong shoe is a slow injury.",
    description: "Most men wear shoes half a size too small. Understanding your foot shape — length, width, arch — changes how you buy footwear for the rest of your life.",
  },
  {
    label: "Dry Skin & Cracking",
    href: "/waitlist?kit=dry-skin",
    image: "/images/pexels-29145634.jpg",
    tagline: "Cracks heal. Calluses soften.",
    description: "Heel fissures and rough skin aren't just cosmetic — deep cracks can become painful entry points for infection. A targeted moisturizing routine makes a visible difference in days.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function Homepage2() {
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);

  return (
    <div style={{ fontFamily: body, background: c.bg, color: c.text, minHeight: "100vh" }}>

      {/* ── Case study banner ── */}
      <div style={{
        background: "#DC2626", color: "white", fontFamily: body,
        fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", textAlign: "center",
        padding: "10px 16px", position: "sticky", top: 0, zIndex: 100,
      }}>
        ⚠ Case Study Artifact — Rejected Direction: Clinical / Health Advisory Palette
      </div>

      {/* ── Nav ── */}
      <header style={{
        background: c.surface, borderBottom: `1px solid ${c.border}`,
        padding: "0 40px", height: 64, position: "sticky", top: 36, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
      }}>
        <span style={{ fontFamily: body, fontSize: 15, fontWeight: 700, color: c.primary, letterSpacing: ".02em" }}>
          Men&apos;s Sole Revival
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Library", "Kits", "About"].map((item) => (
            <span key={item} style={{ fontSize: 14, fontWeight: 500, color: c.textMuted }}>{item}</span>
          ))}
        </div>
        <Link href="/waitlist" style={{
          background: c.primaryMid, color: "white", fontFamily: body,
          fontSize: 13, fontWeight: 600, padding: "8px 18px",
          borderRadius: 6, textDecoration: "none",
        }}>
          Join the Waitlist
        </Link>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: c.bgSubtle, borderBottom: `1px solid ${c.border}` }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "80px 40px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        }}>
          {/* Left: copy */}
          <div>
            <span style={{
              display: "inline-block", background: c.bgInfo, color: c.primaryMid, fontFamily: body,
              fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
              textTransform: "uppercase", padding: "5px 12px", borderRadius: 4, marginBottom: 20,
            }}>
              Preventive Foot Health · Men 40+
            </span>

            <h1 style={{
              fontFamily: heading, fontSize: 36, fontWeight: 700,
              lineHeight: 1.25, color: c.primary, marginBottom: 20,
            }}>
              Chronic foot conditions<br />are common, progressive,<br />and largely preventable.
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.8, color: c.textMuted, maxWidth: 440, marginBottom: 32 }}>
              Plantar fasciitis, onychomycosis, hallux deformity, and xerotic heel fissures affect
              a significant proportion of men over 40. Early intervention and consistent self-care
              protocols produce measurably better long-term outcomes than delayed treatment.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/waitlist" style={{
                background: c.primaryMid, color: "white", fontFamily: body,
                fontSize: 14, fontWeight: 600, padding: "12px 24px",
                borderRadius: 6, textDecoration: "none",
              }}>
                Join the Waitlist
              </Link>
              <Link href="/learn" style={{
                border: `1.5px solid ${c.borderStrong}`, color: c.text, fontFamily: body,
                fontSize: 14, fontWeight: 500, padding: "12px 24px",
                borderRadius: 6, textDecoration: "none", background: c.surface,
              }}>
                Browse the Library
              </Link>
            </div>
            <p style={{ fontFamily: body, fontSize: 12, color: c.textLight, marginTop: 12 }}>
              Free resource library — no account required.
            </p>

            {/* Clinical: condition taxonomy */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
              {["Onychomycosis","Plantar Fasciitis","Hallux Deformity","Xerosis","Biomechanics","Footwear Fit"].map((tag) => (
                <span key={tag} style={{
                  background: c.bgInfo, color: c.primaryMid, fontFamily: body,
                  fontSize: 11, fontWeight: 600, padding: "4px 10px",
                  borderRadius: 20, letterSpacing: ".04em",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: hero image */}
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 420 }}>
            <Image
              src="/images/pexels-13122754.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div style={{
              position: "absolute", bottom: 16, left: 16,
              background: "white", borderRadius: 8, padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 2px 12px rgba(0,0,0,.1)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.health }} />
              <span style={{ fontFamily: body, fontSize: 12, fontWeight: 600, color: c.primary }}>
                Treatable. Preventable. Yours to fix.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "56px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: c.textLight, marginBottom: 40 }}>
            The numbers most men ignore
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {stats.map((s, i) => (
              <div key={s.value} style={{
                padding: "8px 40px",
                borderRight: i === 0 ? `1px solid ${c.border}` : "none",
                paddingLeft: i === 0 ? 0 : undefined,
              }}>
                <span style={{
                  fontFamily: heading, fontSize: 48, fontWeight: 700,
                  color: c.primaryMid, display: "block",
                }}>
                  {s.value}
                </span>
                <span style={{ fontFamily: body, display: "block", fontSize: 14, color: c.textMuted, marginTop: 6, lineHeight: 1.6 }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: body, display: "block", fontSize: 12, fontWeight: 600, color: c.health, marginTop: 4 }}>
                  {s.context}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── From the Library — sticky left + scrolling right ── */}
      <section style={{ borderTop: `1px solid ${c.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "100%" }}>

          {/* Left: sticky */}
          <div style={{ borderRight: `1px solid ${c.border}` }}>
            <div style={{
              position: "sticky", top: 100,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: "100vh", padding: "56px 40px 56px 40px",
            }}>
              <div>
                <h2 style={{ fontFamily: heading, fontSize: 48, fontWeight: 700, color: c.primary, lineHeight: 1.1 }}>
                  From<br />the<br />Library.
                </h2>
                <Link href="/learn" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  marginTop: 24, border: `1.5px solid ${c.primary}`,
                  padding: "10px 20px", fontFamily: body,
                  fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                  textTransform: "uppercase", color: c.primary, textDecoration: "none",
                  borderRadius: 6,
                }}>
                  View all guides
                </Link>
              </div>

              {/* Featured article */}
              <Link href={`/blog/${articles[0].slug}`} style={{ display: "block", textDecoration: "none", marginTop: 40 }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", borderRadius: 10, overflow: "hidden" }}>
                  <Image src={articles[0].image} alt={articles[0].title} fill className="object-cover" />
                </div>
                <p style={{ fontFamily: body, marginTop: 14, fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: c.accent }}>
                  {articles[0].category} · {articles[0].readTime} read
                </p>
                <h3 style={{ fontFamily: heading, marginTop: 8, fontSize: 20, fontWeight: 700, color: c.primary, lineHeight: 1.35 }}>
                  {articles[0].title}
                </h3>
                <p style={{ fontFamily: body, marginTop: 8, fontSize: 13, lineHeight: 1.7, color: c.textMuted }}>
                  {articles[0].excerpt}
                </p>
              </Link>
            </div>
          </div>

          {/* Right: scrolling articles */}
          <div style={{ borderTop: `1px solid ${c.border}` }}>
            {articles.slice(1, 5).map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                style={{
                  display: "flex", gap: 20, padding: "32px 40px",
                  borderBottom: `1px solid ${c.border}`, textDecoration: "none",
                  background: c.surface, transition: "background .15s",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0, width: 130, height: 100, borderRadius: 8, overflow: "hidden" }}>
                  <Image src={a.image} alt={a.title} fill className="object-cover" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: c.accent }}>
                    {a.category} · {a.readTime} read
                  </p>
                  <h3 style={{ fontFamily: heading, marginTop: 6, fontSize: 17, fontWeight: 700, color: c.primary, lineHeight: 1.4 }}>
                    {a.title}
                  </h3>
                  <p style={{ fontFamily: body, marginTop: 6, fontSize: 13, lineHeight: 1.65, color: c.textMuted }}>
                    {a.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Why it matters — editorial split ── */}
      <section style={{ display: "flex", minHeight: 460 }}>
        <div style={{ position: "relative", width: "50%" }}>
          <Image
            src="/images/pexels-10904211.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div style={{
          width: "50%", display: "flex", alignItems: "center",
          background: c.bgSubtle, padding: "56px 60px",
        }}>
          <div>
            <div style={{ width: 32, height: 2, background: c.primaryMid, marginBottom: 20 }} />
            <h2 style={{
              fontFamily: heading, fontSize: 32, fontWeight: 700,
              color: c.primary, lineHeight: 1.2,
            }}>
              It compounds upward.
            </h2>
            <p style={{ fontFamily: body, marginTop: 20, maxWidth: 400, fontSize: 15, lineHeight: 1.8, color: c.textMuted }}>
              When your feet work well, everything else gets easier — your knees, your posture,
              your energy. This is the leverage most men overlook, and the reason we built this.
            </p>
            <Link href="/about" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 28, fontFamily: body, fontSize: 12, fontWeight: 700,
              letterSpacing: ".1em", textTransform: "uppercase",
              color: c.primaryMid, textDecoration: "none",
            }}>
              Why we built this →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Topics — clinical: simple list + side panel ── */}
      <section style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", minHeight: 560 }}>

          {/* Left: image */}
          <div style={{ position: "relative", overflow: "hidden", background: c.bgSubtle }}>
            <Image
              src={topics[activeTopicIdx].image}
              alt=""
              fill
              className="object-cover"
              style={{ opacity: 0.6 }}
            />
          </div>

          {/* Center: topic list */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            alignItems: "center", padding: "60px 24px", textAlign: "center",
            borderLeft: `1px solid ${c.border}`, borderRight: `1px solid ${c.border}`,
          }}>
            <p style={{ fontFamily: heading, fontSize: 28, fontWeight: 700, color: c.primary, marginBottom: 32 }}>
              Know Your Feet.
            </p>
            {topics.map((t, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveTopicIdx(i)}
                onClick={() => setActiveTopicIdx(i)}
                style={{
                  fontFamily: heading, fontSize: 24, fontWeight: 700,
                  color: i === activeTopicIdx ? c.primary : c.textLight,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "8px 0", lineHeight: 1.2, display: "block", width: "100%",
                  transition: "color .2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right: description panel */}
          <div style={{
            background: c.bgSubtle, padding: "40px 32px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            borderTop: `3px solid ${c.primaryMid}`,
          }}>
            <span style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: c.textLight }}>
              {String(activeTopicIdx + 1).padStart(2, "0")} / {String(topics.length).padStart(2, "0")}
            </span>

            <div>
              <p style={{ fontFamily: body, fontSize: 13, fontStyle: "italic", color: c.primaryMid, marginBottom: 12 }}>
                {topics[activeTopicIdx].tagline}
              </p>
              <h3 style={{ fontFamily: heading, fontSize: 22, fontWeight: 700, color: c.primary, lineHeight: 1.25, marginBottom: 14 }}>
                {topics[activeTopicIdx].label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.75, color: c.textMuted }}>
                {topics[activeTopicIdx].description}
              </p>
            </div>

            <Link href={topics[activeTopicIdx].href} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: body, fontSize: 11, fontWeight: 700,
              letterSpacing: ".12em", textTransform: "uppercase",
              color: c.primaryMid, textDecoration: "none",
            }}>
              Explore this topic →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Kits ── */}
      <section style={{ background: "#F1F5F9", borderBottom: `1px solid ${c.border}`, padding: "64px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <h2 style={{ fontFamily: heading, fontSize: 28, fontWeight: 700, color: c.primary }}>
                The kits.
              </h2>
              <p style={{ fontFamily: body, marginTop: 10, maxWidth: 480, fontSize: 14, lineHeight: 1.7, color: c.textMuted }}>
                Each kit bundles a simple routine with the right tools. Tell us which you need — we&apos;ll prioritize what ships first.
              </p>
            </div>
            <Link href="/kits" style={{ fontFamily: body, fontSize: 13, fontWeight: 600, color: c.primaryMid, textDecoration: "underline" }}>
              View all kits →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {kits.map((kit) => (
              <Link key={kit.title} href={kit.href} style={{
                display: "flex", flexDirection: "column",
                background: c.surface, border: `1px solid ${c.border}`,
                borderRadius: 10, padding: 24, textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}>
                {kit.tag && (
                  <span style={{
                    display: "inline-block", alignSelf: "flex-start",
                    background: c.healthLight, color: "#065F46", fontFamily: body,
                    fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
                    textTransform: "uppercase", padding: "4px 10px",
                    borderRadius: 4, marginBottom: 16,
                  }}>
                    {kit.tag}
                  </span>
                )}
                <h3 style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, color: c.primary, lineHeight: 1.3 }}>
                  {kit.title}
                </h3>
                <p style={{ fontFamily: body, marginTop: 10, flex: 1, fontSize: 13, lineHeight: 1.7, color: c.textMuted }}>
                  {kit.desc}
                </p>
                <p style={{ fontFamily: body, marginTop: 20, fontSize: 13, fontWeight: 600, color: c.primaryMid }}>
                  Join waitlist →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parallax CTA — clinical version ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 40px", textAlign: "center", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Image
          src="/images/pexels-35206081.jpg"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.12 }}
        />
        <div style={{ position: "absolute", inset: 0, background: c.bgSubtle, opacity: 0.92 }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 560 }}>
          <h2 style={{ fontFamily: heading, fontSize: 40, fontWeight: 700, color: c.primary, lineHeight: 1.15, marginBottom: 20 }}>
            Be first.
          </h2>
          <p style={{ fontFamily: body, fontSize: 16, lineHeight: 1.8, color: c.textMuted, marginBottom: 32 }}>
            We&apos;re building this carefully. Join the waitlist and help shape what gets built first — no spam, no pressure.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/waitlist" style={{
              background: c.primaryMid, color: "white", fontFamily: body,
              fontSize: 14, fontWeight: 600, padding: "14px 28px",
              borderRadius: 6, textDecoration: "none", display: "inline-block",
            }}>
              Join the Waitlist
            </Link>
            <Link href="/about" style={{
              border: `1.5px solid ${c.borderStrong}`, color: c.text, fontFamily: body,
              fontSize: 14, fontWeight: 500, padding: "14px 28px",
              borderRadius: 6, textDecoration: "none",
              background: c.surface, display: "inline-block",
            }}>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why rejected annotation ── */}
      <div style={{ background: "#FFFBEB", borderTop: `2px solid #FDE047`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <strong style={{
            display: "block", fontFamily: body, fontSize: 11, fontWeight: 700,
            letterSpacing: ".08em", textTransform: "uppercase", color: "#92400E", marginBottom: 8,
          }}>
            Case Study Note — Why This Direction Was Rejected
          </strong>
          <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.75, color: "#713F12", maxWidth: 800 }}>
            This palette reads as a health advisory portal — not a brand. The cool medical blues,
            rounded cards, and Merriweather serif signal &ldquo;clinic,&rdquo; not &ldquo;community.&rdquo;
            For a target audience of men over 40 who are already shame-adjacent about the topic,
            a clinical aesthetic reinforces the barrier rather than lowering it. It says:{" "}
            <em>&ldquo;This is a medical issue.&rdquo;</em>{" "}
            The chosen direction says: <em>&ldquo;This is something men handle.&rdquo;</em>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: c.primary, padding: "56px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
            <div>
              <p style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, color: "white" }}>
                Men&apos;s Sole Revival
              </p>
              <p style={{ fontFamily: body, marginTop: 12, maxWidth: 280, fontSize: 13, lineHeight: 1.7, color: "#93C5FD" }}>
                Foot care, footwear, and the daily habits that keep men moving well into their best decades.
              </p>
            </div>
            <div style={{ display: "flex", gap: 60 }}>
              <div>
                <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#60A5FA" }}>
                  Explore
                </p>
                <ul style={{ listStyle: "none", marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Library", "Kits", "About"].map((l) => (
                    <li key={l}><span style={{ fontFamily: body, fontSize: 13, color: "#BFDBFE" }}>{l}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#60A5FA" }}>
                  Company
                </p>
                <ul style={{ listStyle: "none", marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["About", "Waitlist"].map((l) => (
                    <li key={l}><span style={{ fontFamily: body, fontSize: 13, color: "#BFDBFE" }}>{l}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 48, paddingTop: 24, borderTop: `1px solid #1E40AF`,
            fontFamily: body, fontSize: 12, color: "#60A5FA",
          }}>
            © {new Date().getFullYear()} Men&apos;s Sole Revival. Built with intention.
          </div>
        </div>
      </footer>

    </div>
  );
}
