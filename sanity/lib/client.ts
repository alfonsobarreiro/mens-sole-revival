import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Read client — CDN-cached, no token. Safe to use anywhere (server or
 * client), returns published content only.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false for real-time data (e.g., previews)
})

/**
 * Write client — bypasses CDN, requires SANITY_API_WRITE_TOKEN. Server-only:
 * import this ONLY from server actions / route handlers, never from a
 * client component (the token is a secret without the NEXT_PUBLIC_ prefix).
 *
 * When the token is missing, the client is still constructed but any write
 * will fail with an auth error — call sites should try/catch and fail soft
 * so a missing token never breaks the user-facing flow. Get a token at
 * https://sanity.io/manage → your project → API → Tokens (Editor role).
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'published',
})
