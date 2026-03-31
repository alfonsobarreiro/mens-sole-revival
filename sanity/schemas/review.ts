import { defineField, defineType } from 'sanity'

/**
 * Review — an editorial product evaluation.
 *
 * Design decisions:
 * - rating stored as number (1–10 scale, displayed as /10 or converted to stars)
 * - verdict is a controlled enum — forces editorial discipline (no wishy-washy middle)
 * - price is informational only — this is a review site, not e-commerce
 * - pros/cons are simple string arrays — keep them scannable, one idea per item
 * - affiliateUrl is optional — not every review needs monetization
 * - category matches the site's existing topic taxonomy
 */
export const reviewType = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    // ── Product Identity ─────────────────────────────────────────────────────
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      description: 'Full product name as it appears on packaging (e.g. "Superfeet BLUE Insoles")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      description: 'Manufacturer or brand name (e.g. "Superfeet", "Lamisil", "Gehwol")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path: /reviews/{slug}',
      options: { source: 'productName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Classification ───────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Insoles & Orthotics', value: 'insoles' },
          { title: 'Antifungal & Nail Care', value: 'antifungal' },
          { title: 'Creams & Moisturizers', value: 'creams' },
          { title: 'Foot Powder & Deodorant', value: 'powder' },
          { title: 'Tools & Accessories', value: 'tools' },
          { title: 'Footwear', value: 'footwear' },
          { title: 'Toe Alignment', value: 'alignment' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Verdict ──────────────────────────────────────────────────────────────
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'string',
      description: 'The editorial call. Be decisive.',
      options: {
        list: [
          { title: '✅ Recommended — buy it', value: 'recommended' },
          { title: '⚠️ Conditional — works, but read the notes', value: 'conditional' },
          { title: '❌ Skip — better options exist', value: 'skip' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (out of 10)',
      type: 'number',
      description: 'Whole or half numbers only. 7 = solid, 8 = good, 9 = excellent, 10 = rare.',
      validation: (Rule) => Rule.required().min(1).max(10),
    }),

    // ── Copy ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One sharp sentence. The verdict in plain language. Shown on the card.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: '2–3 sentences. Shown below the verdict on the detail page. Assume the reader is skeptical.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'One idea per item. Specific — not "works well" but "eliminates odor for 8+ hours in field testing".',
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Be honest. One idea per item. If there are no real cons, revisit the rating.',
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'whyItWorks',
      title: 'Why It Works (or Doesn\'t)',
      type: 'text',
      rows: 4,
      description: 'The evidence-based mechanism. This is the section that earns trust — skip the marketing language.',
    }),
    defineField({
      name: 'whoItsFor',
      title: 'Who It\'s For',
      type: 'string',
      description: 'Narrow this down. "Men over 40 with plantar fasciitis who need an OTC option before seeing a podiatrist."',
    }),

    // ── Pricing & Links ──────────────────────────────────────────────────────
    defineField({
      name: 'retailPriceUsd',
      title: 'Retail Price (USD)',
      type: 'number',
      description: 'Approximate retail, for reference. Not shown as a buy price.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'affiliateUrl',
      title: 'Affiliate / Find It Link',
      type: 'url',
      description: 'Where to buy it. Amazon, brand site, or retailer. Optional.',
    }),
    defineField({
      name: 'affiliateLabel',
      title: 'Link Label',
      type: 'string',
      description: 'Button label for the affiliate link (e.g. "View on Amazon", "Buy from Superfeet")',
      initialValue: 'View on Amazon',
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      description: 'Product shot — clean background preferred. Editorial photography also works.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Additional images for the detail page.',
    }),

    // ── Publishing ───────────────────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
      description: 'Used for sorting and freshness signals.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Use increments of 10.',
      initialValue: 10,
    }),
  ],

  preview: {
    select: {
      title: 'productName',
      subtitle: 'verdict',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      const verdictLabel: Record<string, string> = {
        recommended: '✅ Recommended',
        conditional: '⚠️ Conditional',
        skip: '❌ Skip',
      }
      return {
        title,
        subtitle: verdictLabel[subtitle] ?? subtitle,
        media,
      }
    },
  },
})
