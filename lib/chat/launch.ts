/**
 * The launch switch for /ask.
 *
 * false: the page works at /ask but nothing links to it, it is noindex, and it
 *        stays out of the sitemap. Safe to merge and test on the live domain.
 * true:  article footers and assessment results link to it, search engines may
 *        index it, and the sitemap lists it.
 *
 * Before flipping to true:
 *   1. Vercel Firewall rate-limit rule exists for /api/ask
 *   2. AI Gateway credits purchased (lifts the 5 requests/min free-tier limit)
 *   3. Voice pass done on components/chat/copy.ts and the red-flag list
 *   4. Update the /ask date in app/sitemap.ts to the launch day
 */
export const ASK_LAUNCHED = false;
