# Men's Sole Revival — brand basics

Working reference for the logo, palette, and typography. Pairs with the
Figma `02 · Brand & Identity — Signature` (node `33162:2`).

---

## Logo

The mark is **M01** — a serif "M" set in Lora display at 152 pt. Chosen
over a lowercase "msr" wordmark and a Barlow Condensed "MSR" wordmark
because it reads editorial / premium / restrained rather than
"athletic-bro." Echoes the Halden "H" pattern.

### Files in `/public/`

| File | Use | Size |
|---|---|---|
| `logo-m01-navy.png` | Primary mark on light backgrounds | 1024 × 1024 |
| `logo-m01-cognac.png` | Accent treatments | 1024 × 1024 |
| `logo-m01-stone.png` | Subtle / muted contexts | 1024 × 1024 |
| `logo-m01-charcoal.png` | Print, business cards, dark-on-light | 1024 × 1024 |
| `logo-msr-lockup-horizontal.png` | Horizontal mark + wordmark + tagline | 340 × 60 |
| `logo-msr-lockup-stacked.png` | Stacked mark + wordmark | 200 × 80 |
| `logo-msr-light.svg` | Current site nav + footer logo | vector |

### Usage rules

- Don't recolor outside the four approved colorways above.
- Don't crop or rotate the mark.
- Minimum size: 32 × 32 px for the monogram, 200 px wide for the horizontal lockup.
- Clear space around the mark: at least 1/4 of the mark's height.

---

## Palette

All values live in `app/globals.css` as CSS custom properties. Tailwind
reads them via the `brand`, `accent`, `neutral` keys in
`tailwind.config.ts`.

### Brand (Navy)

| Token | Hex | Use |
|---|---|---|
| `brand-50` | `#F0F2F4` | Subtle background tints |
| `brand-100` | `#DFE6EC` | Hover / dividers on light |
| `brand-200` | `#BBCDDD` | Borders, low-emphasis |
| `brand-300` | `#82A8CA` | — |
| `brand-400` | `#4183BE` | — |
| `brand-500` | `#1C3F5E` | **Primary brand color** · active nav, primary text |
| `brand-600` | `#18344D` | Hover states |
| `brand-700` | `#112840` | Body backgrounds on dark UI |
| `brand-800` | `#0C1A26` | — |
| `brand-900` | `#091016` | **Hero / footer background** · darkest dark |

### Accent (Cognac)

| Token | Hex | Use |
|---|---|---|
| `accent-50` | `#F4F2F0` | Warning / safety boxes background |
| `accent-100` | `#ECE4DF` | Subtle accent washes |
| `accent-200` | `#DDC8BB` | — |
| `accent-300` | `#CA9E81` | — |
| `accent-400` | `#BE7241` | Hero eyebrows on dark backgrounds |
| `accent-500` | `#C4703A` | **Primary accent** · CTAs, callouts, "flagged" state |
| `accent-600` | `#A35E32` | Eyebrows on light backgrounds, accent hover |
| `accent-700` | `#8C4520` | Deepest accent text |
| `accent-800` | `#532F18` | — |
| `accent-900` | `#301D11` | — |

### Neutral (Warm Gray)

Matches the Wayfarer neutral scale so cross-project assets stay coherent.

| Token | Hex | Use |
|---|---|---|
| `neutral-50` | `#F8F7F7` | **Page surface** · default content background |
| `neutral-100` | `#EEEDEC` | Card dividers, subtle separators |
| `neutral-200` | `#D6D3D1` | Default borders |
| `neutral-300` | `#B7B2AE` | Disabled state |
| `neutral-400` | `#938C86` | Muted text, captions |
| `neutral-500` | `#6B6560` | Secondary text |
| `neutral-600` | `#534F4B` | Body text on light surfaces |
| `neutral-700` | `#403D3A` | **Default body color** |
| `neutral-800` | `#2D2B29` | Heading text on light |
| `neutral-900` | `#1D1C1B` | Darkest text |

### Semantic colors used selectively

- **Emerald-500** (`#10B981`) — assessment sidebar completed-section
  checkmark + email-sent success state. Reads as universal "done."
- **Amber / teal / red** Tailwind defaults — Verdicts on review cards
  (`Recommended` emerald, `Conditional` amber, `Skip` red). Use only
  for review-verdict surfaces.

---

## Typography

Three families, each with a job. Token recipes live in
`components/typography.ts` and are imported as `type.displaySection`,
`type.h2`, `type.body`, etc. — keep using the recipes rather than
hand-rolling sizes.

### Display — Barlow Condensed

Architectural section labels and hero headlines. Used sparingly —
the H1 on the homepage and the H1 on the assessment hero, that's it.

```
font-display text-5xl font-extrabold uppercase leading-none tracking-tight md:text-7xl lg:text-8xl  // displayHero
font-display text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl                    // displaySection
font-display text-2xl font-bold uppercase tracking-tight md:text-3xl                                 // displaySm
```

### Editorial — Lora

Article headings and the wordmark in lockups. Lora gives the
"editorial / premium / restrained" voice that distinguishes MSR from
the slick-affiliate-blog competitive set.

```
font-heading text-5xl font-semibold leading-tight tracking-tight md:text-6xl   // display
font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl   // h1
font-heading text-2xl font-semibold leading-snug tracking-tight md:text-3xl    // h2
font-heading text-xl font-semibold leading-snug                                // h3
font-heading text-lg font-semibold                                             // h4
```

### UI — DM Sans

Body copy, labels, captions, buttons, navigation. Workhorse.

```
text-lg leading-relaxed text-neutral-600              // lead
text-base leading-7 text-neutral-700                  // body
text-sm leading-6 text-neutral-600                    // small
text-sm text-neutral-500                              // muted
text-sm font-semibold text-neutral-700                // label
text-xs font-semibold uppercase tracking-widest text-neutral-400  // overline
```

### Font sources

All three families are Google Fonts. Loaded via `next/font` in
`app/layout.tsx`. No external CDN, no FOUT.

---

## Cross-references

- **Figma signatures:** `02 · Brand & Identity — Signature` (file
  `ftIe1aelQLB7hOR4PUA9lR`, node `33162:2`)
- **Logo originals:** node `33165:2` (navy), `33165:4` (cognac),
  `33165:6` (stone), `33165:8` (charcoal)
- **Tailwind config:** `tailwind.config.ts`
- **CSS variables:** `app/globals.css`
- **Typography recipes:** `components/typography.ts`
