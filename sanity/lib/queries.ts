import { groq } from 'next-sanity'

/**
 * Fetch all kits, ordered by their manual sort order.
 * Returns the fields needed for the /kits listing page.
 */
export const kitsQuery = groq`
  *[_type == "kit"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    tag,
    description,
    waitlistParam,
    status,
    "imageUrl": image.asset->url
  }
`

/**
 * Fetch a single kit by slug (for future individual kit pages)
 */
export const kitBySlugQuery = groq`
  *[_type == "kit" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tag,
    description,
    waitlistParam,
    status,
    "imageUrl": image.asset->url
  }
`

// ── Products ─────────────────────────────────────────────────────────────────

/**
 * Fetch all non-hidden products for the /shop listing page.
 * Ordered by manual sort order, then title.
 */
export const productsQuery = groq`
  *[_type == "product" && status != "hidden"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    priceInCents,
    compareAtPriceInCents,
    status,
    category,
    waitlistParam,
    "imageUrl": image.asset->url,
    "imageHotspot": image.hotspot,
  }
`

/**
 * Fetch a single product by slug for the /shop/[slug] detail page.
 */
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    priceInCents,
    compareAtPriceInCents,
    status,
    category,
    waitlistParam,
    "imageUrl": image.asset->url,
    "imageHotspot": image.hotspot,
    "gallery": gallery[].asset->url,
    contents,
    whyItWorks,
  }
`

// ── Reviews ───────────────────────────────────────────────────────────────────

/**
 * Fetch all published reviews for the /reviews listing page.
 * Ordered by manual sort order, then most recently published.
 */
export const reviewsQuery = groq`
  *[_type == "review" && status == "published"] | order(order asc, publishedAt desc) {
    _id,
    productName,
    brand,
    "slug": slug.current,
    category,
    verdict,
    rating,
    tagline,
    retailPriceUsd,
    publishedAt,
    "imageUrl": image.asset->url,
  }
`

/**
 * Fetch a single review by slug for the /reviews/[slug] detail page.
 */
export const reviewBySlugQuery = groq`
  *[_type == "review" && slug.current == $slug][0] {
    _id,
    productName,
    brand,
    "slug": slug.current,
    category,
    verdict,
    rating,
    tagline,
    summary,
    pros,
    cons,
    whyItWorks,
    whoItsFor,
    retailPriceUsd,
    affiliateUrl,
    affiliateLabel,
    publishedAt,
    "imageUrl": image.asset->url,
    "gallery": gallery[].asset->url,
  }
`
