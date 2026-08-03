import { defineField, defineType } from 'sanity'

/**
 * AssessmentSubmission — one document per completed assessment email capture.
 *
 * Written from app/actions/assessment-email.ts every time a user submits their
 * email on the results screen. Failure to write is soft: the user's own results
 * email + notification still send even if the Sanity write fails, so this
 * capture never blocks the primary funnel.
 *
 * Why the object-with-arbitrary-keys shapes (flagsBySection, durationBySection,
 * itemsBySection) are normalized into arrays of `{sectionId, ...}` objects:
 * Sanity models arbitrary key maps as arrays of typed objects for clean Studio
 * UI + GROQ queryability. Example query:
 *   *[_type == "assessmentSubmission"]{
 *     email, submittedAt, totalFlags,
 *     "nailFlags": flagsBySection[sectionId=="nail-health"][0].count
 *   }
 *
 * Fields preserve everything the server action already has in memory, so
 * future analysis (co-occurrence, item discrimination, duration patterns,
 * drop-off segments) does not need a code change to unlock.
 */

const SECTION_IDS = [
  { title: 'Nail Health', value: 'nail-health' },
  { title: 'Skin & Heels', value: 'skin-heels' },
  { title: 'Pain & Inflammation', value: 'pain-inflammation' },
  { title: 'Alignment & Structure', value: 'alignment-structure' },
  { title: 'Footwear Fit', value: 'footwear-fit' },
]

const DURATIONS = [
  { title: 'Less than a month', value: 'recent' },
  { title: '1 to 6 months', value: 'ongoing' },
  { title: 'More than 6 months', value: 'chronic' },
]

export const assessmentSubmissionType = defineType({
  name: 'assessmentSubmission',
  title: 'Assessment Submission',
  type: 'document',
  fields: [
    // ── Identity + when ──────────────────────────────────────────────────────
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Submitter email. Cross-reference with the Resend audience.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      description: 'ISO timestamp of the server-action call.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'checkIn',
      title: 'Opted into 30/90 Check-in',
      type: 'boolean',
      description: 'True when the check-in checkbox was left on (Recommended, default true).',
    }),

    // ── Aggregate signal ─────────────────────────────────────────────────────
    defineField({
      name: 'totalFlags',
      title: 'Total Flags',
      type: 'number',
      description: 'Sum of items flagged across every section they took.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'notSureCount',
      title: 'Not-Sure Count',
      type: 'number',
      description: 'Items where the user answered "Not sure" rather than yes/no.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'attemptedSections',
      title: 'Attempted Sections',
      type: 'array',
      of: [{ type: 'string', options: { list: SECTION_IDS, layout: 'radio' } }],
      description: 'Which of the 5 sections the user actually took (triage may skip sections that do not match their symptoms).',
    }),

    // ── Per-section detail ───────────────────────────────────────────────────
    defineField({
      name: 'flagsBySection',
      title: 'Flags By Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionId',
              type: 'string',
              options: { list: SECTION_IDS },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'count',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: { sectionId: 'sectionId', count: 'count' },
            prepare: ({ sectionId, count }) => ({
              title: `${sectionId}: ${count}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'durationBySection',
      title: 'Duration By Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionId',
              type: 'string',
              options: { list: SECTION_IDS },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'duration',
              type: 'string',
              options: { list: DURATIONS, layout: 'radio' },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { sectionId: 'sectionId', duration: 'duration' },
            prepare: ({ sectionId, duration }) => ({
              title: `${sectionId}: ${duration}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'itemsBySection',
      title: 'Items By Section (Detail)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionId',
              type: 'string',
              options: { list: SECTION_IDS },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'items',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Exact item text as shown on the assessment.',
            },
          ],
          preview: {
            select: { sectionId: 'sectionId', items: 'items' },
            prepare: ({ sectionId, items }) => ({
              title: sectionId,
              subtitle: items?.length ? `${items.length} items` : 'no items',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'flags',
      title: 'Flags By Label (Pre-aggregated)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'count', type: 'number', validation: (Rule) => Rule.required().min(0) },
          ],
          preview: {
            select: { label: 'label', count: 'count' },
            prepare: ({ label, count }) => ({
              title: label,
              subtitle: `${count}`,
            }),
          },
        },
      ],
      description: 'Same items as itemsBySection but pre-aggregated for the notification email + fast display.',
    }),
  ],

  preview: {
    select: {
      email: 'email',
      totalFlags: 'totalFlags',
      submittedAt: 'submittedAt',
      checkIn: 'checkIn',
    },
    prepare({ email, totalFlags, submittedAt, checkIn }) {
      const dateShort = submittedAt
        ? new Date(submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : ''
      return {
        title: email || '(no email)',
        subtitle: `${totalFlags ?? 0} flags · ${checkIn ? 'check-in on' : 'no check-in'} · ${dateShort}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest first',
      name: 'newest',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Most flags first',
      name: 'flagsDesc',
      by: [{ field: 'totalFlags', direction: 'desc' }],
    },
  ],
})
