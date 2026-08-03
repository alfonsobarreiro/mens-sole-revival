import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'mens-sole-revival',
  title: "Men's Sole Revival",

  // basePath must match the Next.js route at app/studio/[[...tool]]/page.tsx.
  // Without this, Sanity treats "studio" as a tool name and shows
  // "Tool not found: studio" on load.
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool(),
    visionTool(), // GROQ query explorer — remove before production if preferred
  ],

  schema: {
    types: schemaTypes,
  },
})
