/**
 * Sanity Studio — embedded at /studio
 * Access: localhost:3001/studio (dev) or yourdomain.com/studio (prod)
 *
 * Route is intentionally NOT protected here — add auth middleware
 * before going to production if you want to restrict access.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
