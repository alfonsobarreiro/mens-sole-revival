// ─────────────────────────────────────────────────────────────────────────────
// Canonical site constants + site-wide structured data.
//
// Single source of truth for the production origin (used by metadataBase,
// canonicals, sitemap, robots, and every JSON-LD block) and the Organization /
// WebSite / WebApplication schemas that don't depend on per-page content.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://www.menssolerevival.com";
export const SITE_NAME = "Men's Sole Revival";

/**
 * Verified sending identity for all transactional email (Resend).
 * Domain send.menssolerevival.com is verified, so this is the production
 * default. Override per-environment with the RESEND_FROM env var if needed.
 */
export const EMAIL_FROM =
  process.env.RESEND_FROM || "Men's Sole Revival <results@send.menssolerevival.com>";
export const SITE_DESCRIPTION =
  "Evidence-based foot-health guides, a 5-minute self-assessment, and daily routines for men over 40.";
export const SITE_EMAIL = "alfonso@barreiro.com";

/** Organization — emitted on every page from the root layout.
 *  SEO Bundle 2 additions: publisher.logo (required for Article rich results)
 *  + sameAs (identity signals for knowledge panel).
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  email: SITE_EMAIL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://barreiro.com",
    "https://www.linkedin.com/in/alfonsobarreiro/",
  ],
  knowsAbout: [
    "foot health",
    "men's foot care",
    "footwear fit",
    "foot pain prevention",
    "toenail fungus",
    "cracked heels",
    "toe alignment",
  ],
};

/** WebSite + SearchAction — wires the guides search box for sitelinks. */
export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/guides?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** WebApplication — the free 5-minute foot-health Assessment tool. */
export const assessmentAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "The Men's Foot Health Assessment",
  url: `${SITE_URL}/assessment`,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "A free 5-minute self-check that flags nail, skin, pain, alignment, and footwear-fit issues, then returns specific guides, a routine, and podiatrist-visit prep.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};
