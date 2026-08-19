/**
 * BreadcrumbList JSON-LD helper — SEO Bundle 4.
 *
 * Google awards breadcrumb rich results (visible SERP trails) to pages
 * that emit BreadcrumbList. Sitewide 5–15% CTR lift per Google's own
 * case studies. Emit via <JsonLd schema={buildBreadcrumb([...])} /> in
 * any layout or page.
 *
 * Item shape: { name, path } — path is the route slug (without host).
 * The final item is the current page.
 */

import { SITE_URL, SITE_NAME } from "@/lib/site";

export interface BreadcrumbItem {
  name: string;
  /** Route path, e.g. "/guides/why-your-feet-hurt-after-40". Omit host. */
  path: string;
}

/** Always-prepended Home crumb. Consumers pass everything after Home. */
const HOME: BreadcrumbItem = { name: SITE_NAME, path: "/" };

export function buildBreadcrumb(trail: BreadcrumbItem[]): Record<string, unknown> {
  const items = [HOME, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * ItemList JSON-LD — for index pages listing many entities (guides,
 * reviews, routines). Establishes the page as a hub vs a duplicate of
 * a single item; wires sitelinks eligibility.
 */
export interface ItemListEntry {
  name: string;
  path: string;
  description?: string;
}

export function buildItemList(
  listName: string,
  entries: ItemListEntry[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${entry.path}`,
      name: entry.name,
      ...(entry.description ? { description: entry.description } : {}),
    })),
  };
}
