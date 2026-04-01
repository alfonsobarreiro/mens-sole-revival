import { redirect } from 'next/navigation'

/**
 * Sanity Studio is available in local development only.
 * Run: npm run dev → localhost:3001/studio
 */
export default function StudioPage() {
  redirect('/')
}
