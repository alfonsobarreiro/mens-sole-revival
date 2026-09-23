import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Read client — CDN-cached, no token, published content only. It can only
 * read while the dataset is public; server code should prefer `serverClient`
 * below. The whole module is server-only so no token can reach a bundle.
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

/**
 * Server read client — token-backed and uncached, for pages and actions that
 * read the dataset from the server. Once the dataset is private the public
 * `client` can't read it; this one still can. Prefer a Viewer-role
 * SANITY_API_READ_TOKEN; the write token is only a fallback so flipping the
 * dataset to private never breaks the site.
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'published',
})
