import { defineField, defineType } from 'sanity'

/**
 * Product — an individual item or kit bundle available in the shop.
 *
 * Design decisions:
 * - price stored in cents (integer) to avoid float rounding issues
 * - compareAtPrice enables "was $X" strikethrough without a separate field
 * - status controls visibility: only 'available' products show Buy CTA
 * - category distinguishes kits (bundles) from individual tools/treatments
 * - contents lets us show "What's in this kit" without separate document refs
 * - waitlistParam links back to the waitlist flow if status is 'waitlist'
 */
export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Full product name (e.g. "Pain & Recovery Kit")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path: /shop/{slug}',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line hook shown on the product card (e.g. "For soreness, fatigue, and everyday ache.")',
    }),

    // ── Pricing ─────────────────────────────────────────────────────────────
    defineField({
      name: 'priceInCents',
      title: 'Price (in cents)',
      type: 'number',
      description: 'Store in cents to avoid float errors. $29.99 → 2999',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'compareAtPriceInCents',
      title: 'Compare-at Price (in cents)',
      type: 'number',
      description: 'Optional. Shows as "was $X" strikethrough when higher than price.',
      validation: (Rule) => Rule.min(0).integer(),
    }),

    // ── Status & Availability ───────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Waitlist Only', value: 'waitlist' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'coming-soon',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'waitlistParam',
      title: 'Waitlist URL Parameter',
      type: 'string',
      description: 'Appended to /waitlist?kit={this} — used when status is "waitlist" (e.g. "pain-recovery")',
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9-]+$/, {
          name: 'kebab-case',
          invert: false,
        }),
    }),

    // ── Classification ──────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Kit (Bundle)', value: 'kit' },
          { title: 'Tool', value: 'tool' },
          { title: 'Treatment', value: 'treatment' },
          { title: 'Supplement', value: 'supplement' },
        ],
        layout: 'radio',
      },
      initialValue: 'kit',
    }),

    // ── Media ───────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Primary Image',
      type: 'image',
      description: 'Hero image — shown on card and product page. Use editorial photography.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Additional product images for the detail page.',
    }),

    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Two to four sentences. What the product solves and why this approach works.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contents',
      title: 'What\'s Included',
      type: 'array',
      description: 'For kit products — list what\'s in the box. Each item appears as a line in the detail page.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'item',
              title: 'Item Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'detail',
              title: 'Detail',
              type: 'string',
              description: 'Short note (e.g. "Medical-grade, 60ml")',
            }),
          ],
          preview: {
            select: { title: 'item', subtitle: 'detail' },
          },
        },
      ],
    }),
    defineField({
      name: 'whyItWorks',
      title: 'Why It Works',
      type: 'text',
      rows: 3,
      description: 'Evidence-based rationale. No marketing fluff — this is the reasoning a skeptical man respects.',
    }),

    // ── Sort ────────────────────────────────────────────────────────────────
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
      title: 'title',
      subtitle: 'status',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      const statusLabel: Record<string, string> = {
        available: '✅ Available',
        'coming-soon': '🔜 Coming Soon',
        waitlist: '📋 Waitlist',
        hidden: '👁️ Hidden',
      }
      return {
        title,
        subtitle: statusLabel[subtitle] ?? subtitle,
        media,
      }
    },
  },
})
