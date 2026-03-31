import { defineField, defineType } from 'sanity'

/**
 * Kit — a curated product bundle targeting a specific foot health problem.
 * Each kit maps to a /waitlist?kit={waitlistParam} URL.
 */
export const kitType = defineType({
  name: 'kit',
  title: 'Kit',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Short name for the kit (e.g. "Pain & Recovery")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used for future individual kit pages (e.g. /kits/pain-recovery)',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Tag / Badge',
      type: 'string',
      description: 'Short label displayed on the card (e.g. "Most requested", "Foundation")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One to two sentences. What problem this kit solves and why it matters.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'waitlistParam',
      title: 'Waitlist URL Parameter',
      type: 'string',
      description: 'Appended to /waitlist?kit={this} — must be URL-safe (e.g. "pain-recovery")',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9-]+$/, {
          name: 'kebab-case',
          invert: false,
        }),
    }),
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
      initialValue: 'waitlist',
    }),
    defineField({
      name: 'image',
      title: 'Kit Image',
      type: 'image',
      description: 'Optional hero image for the kit card. Use high-contrast editorial photography.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Use increments of 10 to leave room.',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tag',
      media: 'image',
    },
  },
})
