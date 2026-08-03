"use client";

/**
 * Sanity Studio — mounted at /studio.
 *
 * The Studio reads its config from sanity.config.ts at the repo root,
 * which registers the schemas defined in sanity/schemas/. Local editing
 * happens here; the same route ships to production so alfonso@ can
 * browse submissions from any browser signed into Sanity.
 *
 * Auth is handled by Sanity's own OAuth flow: only project members
 * (currently just alfonso@) can read/write. No app-level gate needed.
 *
 * "use client" is required — NextStudio uses React contexts that only
 * work in Client Components. Metadata is intentionally omitted; this
 * route is internal-only and shouldn't be indexed or previewed.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
