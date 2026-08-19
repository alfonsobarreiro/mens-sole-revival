/**
 * UTM tagging helper — attaches source/medium/campaign to outbound links so
 * GA4 attribution stops classifying everything as (direct)/(none).
 *
 * Use for:
 *   - Newsletter email CTAs (source=newsletter)
 *   - Social posts (source=twitter|linkedin|reddit|instagram)
 *   - Guest posts / podcast show-notes (source=<host>)
 *   - Paid campaigns (source=meta|google + campaign name)
 *
 * NOT for internal navigation — Next Link + router covers that.
 */

export interface UTMParams {
  source: string; // e.g. "newsletter", "linkedin", "reddit-r-runningfootcare"
  medium?: string; // e.g. "email", "social", "referral", "cpc"
  campaign?: string; // e.g. "2026-08-launch", "assessment-push"
  content?: string; // e.g. which CTA within the message
  term?: string; // paid search only
}

/**
 * Append UTM params to a URL. Preserves existing query string.
 * Example:
 *   withUtm("https://menssolerevival.com/assessment", {
 *     source: "newsletter",
 *     medium: "email",
 *     campaign: "2026-08-launch",
 *     content: "hero-cta",
 *   })
 *   →  https://menssolerevival.com/assessment?utm_source=newsletter&utm_medium=email&utm_campaign=2026-08-launch&utm_content=hero-cta
 */
export function withUtm(baseUrl: string, params: UTMParams): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", params.source);
  if (params.medium) url.searchParams.set("utm_medium", params.medium);
  if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
  if (params.content) url.searchParams.set("utm_content", params.content);
  if (params.term) url.searchParams.set("utm_term", params.term);
  return url.toString();
}

/**
 * Standard MSR UTM presets — use these instead of hand-writing so campaign
 * names stay consistent across GA reports.
 */
export const UTM = {
  newsletter: (content: string, campaign?: string): UTMParams => ({
    source: "newsletter",
    medium: "email",
    campaign: campaign ?? "regular",
    content,
  }),
  linkedin: (campaign?: string): UTMParams => ({
    source: "linkedin",
    medium: "social",
    campaign: campaign ?? "organic",
  }),
  reddit: (subreddit: string, campaign?: string): UTMParams => ({
    source: `reddit-${subreddit.replace(/^r\//, "")}`,
    medium: "social",
    campaign: campaign ?? "organic",
  }),
  twitter: (campaign?: string): UTMParams => ({
    source: "twitter",
    medium: "social",
    campaign: campaign ?? "organic",
  }),
  guestPost: (host: string, campaign?: string): UTMParams => ({
    source: host,
    medium: "referral",
    campaign: campaign ?? "guest-post",
  }),
  podcast: (show: string, campaign?: string): UTMParams => ({
    source: show,
    medium: "referral",
    campaign: campaign ?? "podcast",
  }),
} as const;
