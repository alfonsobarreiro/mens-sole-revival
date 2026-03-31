"use client";

/**
 * /homepage-3 — Rejected Direction: Salesy / High-Pressure
 *
 * Case study artifact for Men's Sole Revival.
 * Shows the high-pressure, infomercial-style direction that was evaluated
 * and rejected in favor of the dark editorial brand.
 *
 * Intentionally isolated from the MSR brand system.
 * noindex: set in layout.tsx
 */

import Image from "next/image";
import Link from "next/link";

// ── Salesy palette ─────────────────────────────────────────────────────────
const s = {
  bg:          "#FFFFFF",
  bgLight:     "#FFF7ED",
  bgDark:      "#1A1A2E",
  bgDarker:    "#0F0F1A",
  primary:     "#E63946",   // urgent red
  primaryDark: "#C1121F",
  orange:      "#FF6B35",   // action orange
  orangeDark:  "#E85D04",
  yellow:      "#FFD60A",   // highlight yellow
  green:       "#2DC653",   // success green
  greenDark:   "#1A7A31",
  text:        "#1A1A2E",
  textMuted:   "#4B5563",
  textLight:   "#9CA3AF",
  border:      "#E5E7EB",
  starColor:   "#FBBF24",
};

const heading = "var(--font-salesy-heading, 'Oswald', 'Impact', sans-serif)";
const body    = "var(--font-salesy-body, 'Roboto', system-ui, sans-serif)";

// ── Data ───────────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Mike T., 52",
    location: "Phoenix, AZ",
    quote: "I've had toenail fungus for YEARS and just accepted it. Three months into the protocol and I can actually show my feet at the pool. Life-changing.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=70",
    stars: 5,
  },
  {
    name: "David R., 47",
    location: "Austin, TX",
    quote: "My plantar fasciitis was so bad I'd limp to the bathroom every morning. The Pain & Recovery kit had me running again in 6 weeks. Wish I'd found this sooner.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70",
    stars: 5,
  },
  {
    name: "Carlos M., 61",
    location: "Miami, FL",
    quote: "I was embarrassed to take my shoes off anywhere. My wife bought me sandals I refused to wear. Two months later — completely different story. Worth every penny.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=70",
    stars: 5,
  },
];

const benefits = [
  "Step-by-step treatment protocols written in plain English — no medical degree required",
  "Curated product kits with exactly what you need — nothing you don't",
  "The truth about what actually works vs. what's a waste of money",
  "A daily routine so simple you'll actually stick to it",
  "Real before/after timelines so you know what to expect",
  "Zero judgment. This is a safe place to start.",
];

const warningSignsList = [
  { icon: "🦶", text: "Discolored, thick, or brittle toenails that seem to be getting worse" },
  { icon: "🔥", text: "Sharp heel pain first thing in the morning that you've been ignoring for months" },
  { icon: "👟", text: "Toes that have drifted and overlap — and shoes that no longer fit right" },
  { icon: "😣", text: "Dry, cracked heels that bleed or catch on your sheets" },
  { icon: "🚶", text: "Knee or hip pain you never connected to how your feet hit the ground" },
];

const kits = [
  {
    title: "Pain & Recovery Kit",
    tag: "🔥 Most Popular",
    desc: "Everything you need to beat plantar fasciitis, arch pain, and chronic foot fatigue — once and for all.",
    retail: "$89",
    href: "/waitlist?kit=pain-recovery",
  },
  {
    title: "Fungus & Nail Care Kit",
    tag: "⭐ Editor's Pick",
    desc: "The complete protocol to eliminate toenail fungus and restore clean, healthy nails — no prescription needed.",
    retail: "$79",
    href: "/waitlist?kit=fungus-care",
  },
  {
    title: "Toe Alignment Kit",
    tag: "💪 Foundation",
    desc: "Undo years of tight toe boxes with daily spreader exercises and the right tools. Your knees will thank you.",
    retail: "$69",
    href: "/waitlist?kit=alignment-mobility",
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function Homepage3() {
  return (
    <div style={{ fontFamily: body, background: s.bg, color: s.text }}>

      {/* ── Case study banner ── */}
      <div style={{
        background: "#DC2626", color: "white", fontFamily: body,
        fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", textAlign: "center",
        padding: "10px 16px", position: "sticky", top: 0, zIndex: 100,
      }}>
        ⚠ Case Study Artifact — Rejected Direction: Salesy / High-Pressure
      </div>

      {/* ── Urgency ticker ── */}
      <div style={{
        background: s.orange, color: "white", fontFamily: body,
        fontSize: 13, fontWeight: 700, textAlign: "center", padding: "10px 16px",
        letterSpacing: ".02em",
      }}>
        ⚡ LIMITED EARLY ACCESS — Only 500 Waitlist Spots Remaining. Claim Yours Now →
      </div>

      {/* ── Nav ── */}
      <header style={{
        background: s.bgDark, padding: "0 40px", height: 64, position: "sticky",
        top: 70, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: heading, fontSize: 20, fontWeight: 700, color: "white", letterSpacing: ".05em", textTransform: "uppercase" }}>
          Men&apos;s Sole Revival
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Library", "Kits", "About"].map((item) => (
            <span key={item} style={{ fontFamily: body, fontSize: 14, fontWeight: 500, color: "#9CA3AF" }}>{item}</span>
          ))}
        </div>
        <Link href="/waitlist" style={{
          background: s.primary, color: "white", fontFamily: body,
          fontSize: 13, fontWeight: 700, padding: "10px 22px",
          borderRadius: 4, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".05em",
          boxShadow: `0 4px 14px ${s.primary}66`,
        }}>
          🔥 Claim Your Spot
        </Link>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: s.bgDark, padding: "80px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
          <Image
            src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Social proof bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: s.starColor, fontSize: 18 }}>★</span>
              ))}
            </div>
            <span style={{ fontFamily: body, color: "#D1D5DB", fontSize: 14 }}>
              <strong style={{ color: "white" }}>4.9/5</strong> from 2,400+ men who&apos;ve already started
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-block", background: s.primary, color: "white",
                fontFamily: body, fontSize: 12, fontWeight: 700, padding: "6px 14px",
                borderRadius: 4, marginBottom: 20, textTransform: "uppercase", letterSpacing: ".08em",
              }}>
                Finally — A Solution Built For Men Over 40
              </div>

              <h1 style={{
                fontFamily: heading, fontSize: 52, fontWeight: 700, lineHeight: 1.05,
                color: "white", textTransform: "uppercase", letterSpacing: ".02em", marginBottom: 24,
              }}>
                STOP LETTING<br />
                <span style={{ color: s.yellow }}>FOOT PROBLEMS</span><br />
                SLOW YOU DOWN
              </h1>

              <p style={{ fontFamily: body, fontSize: 17, lineHeight: 1.7, color: "#D1D5DB", maxWidth: 460, marginBottom: 32 }}>
                You&apos;ve been ignoring it for years. The fungus. The heel pain. The toes that
                don&apos;t look right anymore. It&apos;s not going away on its own — and every day
                you wait makes it harder to fix.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/waitlist" style={{
                  background: s.orange, color: "white", fontFamily: body,
                  fontSize: 16, fontWeight: 700, padding: "16px 32px",
                  borderRadius: 4, textDecoration: "none", textTransform: "uppercase",
                  letterSpacing: ".06em", boxShadow: `0 6px 20px ${s.orange}55`,
                  display: "inline-block",
                }}>
                  YES — I Want Healthy Feet →
                </Link>
                <Link href="/learn" style={{
                  border: "1.5px solid rgba(255,255,255,.3)", color: "white", fontFamily: body,
                  fontSize: 15, fontWeight: 500, padding: "16px 28px",
                  borderRadius: 4, textDecoration: "none", display: "inline-block",
                }}>
                  Show Me How It Works
                </Link>
              </div>

              <p style={{ fontFamily: body, fontSize: 12, color: "#9CA3AF", marginTop: 14 }}>
                🔒 No credit card required · 100% free to join · Cancel anytime
              </p>
            </div>

            {/* Right: trust box */}
            <div style={{
              background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 12, padding: 32,
            }}>
              <p style={{ fontFamily: heading, fontSize: 13, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: s.yellow, marginBottom: 20 }}>
                What You&apos;re Getting — Free
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {benefits.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: s.green, fontSize: 18, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: body, fontSize: 14, lineHeight: 1.6, color: "#E5E7EB" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Warning signs — pain agitation ── */}
      <section style={{ background: "#FFF1F2", borderTop: `4px solid ${s.primary}`, borderBottom: `1px solid #FEE2E2`, padding: "60px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: heading, fontSize: 36, fontWeight: 700, textTransform: "uppercase",
            color: s.primary, letterSpacing: ".03em", marginBottom: 12,
          }}>
            Are You Recognizing Any of These?
          </h2>
          <p style={{ fontFamily: body, fontSize: 16, color: s.textMuted, marginBottom: 40 }}>
            If you&apos;re nodding along to even <strong>one</strong> of these, you need to keep reading.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left", maxWidth: 640, margin: "0 auto" }}>
            {warningSignsList.map((w, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                background: "white", border: `1px solid #FCA5A5`,
                borderRadius: 8, padding: "16px 20px",
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontFamily: body, fontSize: 15, lineHeight: 1.6, color: s.text }}>{w.text}</span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: heading, fontSize: 22, fontWeight: 700, textTransform: "uppercase",
            color: s.primary, marginTop: 36,
          }}>
            This is NOT normal aging. This is neglect — and it&apos;s fixable.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: s.bgDark, padding: "64px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: heading, fontSize: 14, letterSpacing: ".18em", textTransform: "uppercase", color: s.orange, marginBottom: 12 }}>
            The numbers are shocking
          </p>
          <h2 style={{ fontFamily: heading, fontSize: 32, fontWeight: 700, textTransform: "uppercase", color: "white", marginBottom: 48 }}>
            Men Are Suffering In Silence
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { value: "1 in 4", label: "men over 40 live with chronic foot pain", sub: "That's 30 million Americans suffering right now." },
              { value: "75%", label: "of those cases were preventable", sub: "A simple daily routine is all it takes." },
              { value: "12 yrs", label: "average time men wait before seeking treatment", sub: "12 years of pain they didn't have to live with." },
            ].map((stat) => (
              <div key={stat.value} style={{
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 10, padding: "32px 24px",
              }}>
                <span style={{ fontFamily: heading, fontSize: 52, fontWeight: 700, color: s.yellow, display: "block" }}>
                  {stat.value}
                </span>
                <span style={{ fontFamily: body, fontSize: 15, color: "white", display: "block", marginTop: 8, lineHeight: 1.5 }}>
                  {stat.label}
                </span>
                <span style={{ fontFamily: body, fontSize: 13, color: s.orange, display: "block", marginTop: 8 }}>
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: s.bgLight, borderTop: `1px solid #FED7AA`, padding: "72px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontFamily: heading, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: s.orange, marginBottom: 8 }}>
              Real Men. Real Results.
            </p>
            <h2 style={{ fontFamily: heading, fontSize: 34, fontWeight: 700, textTransform: "uppercase", color: s.text }}>
              Don&apos;t Just Take Our Word For It
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                background: "white", border: `1px solid #FED7AA`,
                borderRadius: 10, padding: 28,
                boxShadow: "0 2px 16px rgba(0,0,0,.07)",
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <span key={i} style={{ color: s.starColor, fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: body, fontSize: 15, lineHeight: 1.7, color: s.text, marginBottom: 24, fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p style={{ fontFamily: body, fontSize: 14, fontWeight: 700, color: s.text }}>{t.name}</p>
                    <p style={{ fontFamily: body, fontSize: 12, color: s.textLight }}>{t.location} · Verified Member</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kits — value stack ── */}
      <section style={{ background: s.bg, borderTop: `1px solid ${s.border}`, padding: "72px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontFamily: heading, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: s.orange, marginBottom: 8 }}>
              The Complete System
            </p>
            <h2 style={{ fontFamily: heading, fontSize: 34, fontWeight: 700, textTransform: "uppercase", color: s.text, marginBottom: 12 }}>
              Choose Your Kit — Join the Waitlist Free
            </h2>
            <p style={{ fontFamily: body, fontSize: 16, color: s.textMuted, maxWidth: 480, margin: "0 auto" }}>
              Tell us which kit you need. We&apos;ll build it first. Waitlist members get first access and exclusive pricing.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {kits.map((kit, i) => (
              <div key={kit.title} style={{
                background: i === 0 ? s.bgDark : "white",
                border: i === 0 ? `2px solid ${s.orange}` : `1px solid ${s.border}`,
                borderRadius: 10, padding: 28, position: "relative",
                boxShadow: i === 0 ? `0 8px 32px ${s.orange}33` : "0 2px 8px rgba(0,0,0,.06)",
              }}>
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: s.orange, color: "white", fontFamily: body,
                    fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20,
                    textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap",
                  }}>
                    Most Popular
                  </div>
                )}
                <p style={{ fontFamily: body, fontSize: 18, marginBottom: 12 }}>{kit.tag}</p>
                <h3 style={{
                  fontFamily: heading, fontSize: 22, fontWeight: 700,
                  textTransform: "uppercase", color: i === 0 ? "white" : s.text, marginBottom: 12,
                }}>
                  {kit.title}
                </h3>
                <p style={{ fontFamily: body, fontSize: 14, lineHeight: 1.7, color: i === 0 ? "#D1D5DB" : s.textMuted, marginBottom: 24 }}>
                  {kit.desc}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24 }}>
                  <span style={{ fontFamily: body, fontSize: 13, color: i === 0 ? "#9CA3AF" : s.textLight, textDecoration: "line-through" }}>
                    Retail {kit.retail}
                  </span>
                  <span style={{ fontFamily: heading, fontSize: 20, fontWeight: 700, color: s.green, textTransform: "uppercase" }}>
                    Free with Waitlist
                  </span>
                </div>
                <Link href={kit.href} style={{
                  display: "block", textAlign: "center",
                  background: i === 0 ? s.orange : s.bgDark,
                  color: "white", fontFamily: body, fontSize: 14, fontWeight: 700,
                  padding: "13px 20px", borderRadius: 6, textDecoration: "none",
                  textTransform: "uppercase", letterSpacing: ".06em",
                }}>
                  I Want This Kit →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee badges ── */}
      <section style={{ background: "#F0FDF4", borderTop: `1px solid #BBF7D0`, borderBottom: `1px solid #BBF7D0`, padding: "48px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { icon: "🔒", title: "Zero Risk", desc: "Free to join. Always will be. No credit card, no commitment, no games." },
            { icon: "✅", title: "Curated by Experts", desc: "Every protocol reviewed by certified podiatric specialists and men's health practitioners." },
            { icon: "🚀", title: "Results or We'll Fix It", desc: "If our kit doesn't work for you, we'll personally help you find what does." },
          ].map((badge) => (
            <div key={badge.title}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{badge.icon}</div>
              <h4 style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, textTransform: "uppercase", color: s.text, marginBottom: 8 }}>
                {badge.title}
              </h4>
              <p style={{ fontFamily: body, fontSize: 14, lineHeight: 1.6, color: s.textMuted }}>
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: s.primary, padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: heading, fontSize: 48, fontWeight: 700,
          textTransform: "uppercase", color: "white", letterSpacing: ".03em", marginBottom: 16,
        }}>
          Your Feet. Your Life.<br />
          <span style={{ color: s.yellow }}>Start Today.</span>
        </h2>
        <p style={{ fontFamily: body, fontSize: 17, color: "rgba(255,255,255,.8)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Every day you wait is another day of preventable damage. Join 2,400+ men who decided their feet were worth taking care of.
        </p>
        <Link href="/waitlist" style={{
          background: s.yellow, color: s.bgDark,
          fontFamily: body, fontSize: 17, fontWeight: 700,
          padding: "18px 40px", borderRadius: 4, textDecoration: "none",
          textTransform: "uppercase", letterSpacing: ".08em", display: "inline-block",
          boxShadow: `0 8px 28px rgba(0,0,0,.3)`,
        }}>
          🔥 Yes — I&apos;m Ready To Start →
        </Link>
        <p style={{ fontFamily: body, fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 16 }}>
          Free forever. No credit card required. 500 spots remaining.
        </p>
      </section>

      {/* ── Why rejected annotation ── */}
      <div style={{ background: "#FFFBEB", borderTop: `2px solid #FDE047`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <strong style={{
            display: "block", fontFamily: body, fontSize: 11, fontWeight: 700,
            letterSpacing: ".08em", textTransform: "uppercase", color: "#92400E", marginBottom: 8,
          }}>
            Case Study Note — Why This Direction Was Rejected
          </strong>
          <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.75, color: "#713F12", maxWidth: 860 }}>
            High-pressure tactics work against this audience. Men over 40 who are already shame-adjacent about a health issue
            don&apos;t respond to urgency — they disengage. Fake scarcity (&ldquo;500 spots remaining&rdquo;), fabricated testimonials,
            and crossed-out &ldquo;retail prices&rdquo; signal inauthenticity. The fear-agitation-solution pattern (&ldquo;stop ignoring it&rdquo;)
            amplifies shame rather than reducing it. This direction optimizes for a single conversion moment; the chosen editorial
            direction builds the trust required for a repeat customer relationship.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: s.bgDarker, padding: "40px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, textTransform: "uppercase", color: "white", letterSpacing: ".08em" }}>
            Men&apos;s Sole Revival
          </span>
          <span style={{ fontFamily: body, fontSize: 12, color: "#6B7280" }}>
            © {new Date().getFullYear()} Men&apos;s Sole Revival. Built with intention.
          </span>
        </div>
      </footer>

    </div>
  );
}
