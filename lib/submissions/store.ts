import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Duration, SectionId } from "@/lib/assessment-routing";

/**
 * Assessment submissions live in Postgres (Neon, via the Vercel Marketplace),
 * reachable only with DATABASE_URL, which exists on the server alone. They
 * used to be Sanity documents in a dataset that is public on the current
 * plan; an email address plus health answers must never sit in a public
 * store, so this module is their only home.
 *
 * Everything here fails loudly with a thrown error; callers decide whether
 * that blocks the visitor (it never should: the results email and the PDF
 * do not depend on the write succeeding).
 *
 * Table: see lib/submissions/schema.sql, applied with scripts/db-migrate.mts.
 */

export type SectionCount = { sectionId: SectionId; count: number };
export type SectionDuration = { sectionId: SectionId; duration: Duration };
export type SectionItems = { sectionId: SectionId; items: string[] };

export interface SubmissionRecord {
  id: string;
  submittedAt: string;
  totalFlags: number;
  checkIn: boolean;
  notSureCount: number;
  attemptedSections: SectionId[];
  flagsBySection: SectionCount[];
  durationBySection: SectionDuration[];
  itemsBySection: SectionItems[];
}

export type NewSubmission = Omit<SubmissionRecord, "id"> & { email: string };

/** True when a database is configured; callers skip the store otherwise. */
export function submissionsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/** Emails are matched case-insensitively and without surrounding space. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

type Row = {
  id: string | number;
  submitted_at: string | Date;
  total_flags: number;
  check_in: boolean;
  not_sure_count: number;
  attempted_sections: SectionId[];
  flags_by_section: SectionCount[];
  duration_by_section: SectionDuration[];
  items_by_section: SectionItems[];
};

function toRecord(r: Row): SubmissionRecord {
  return {
    id: String(r.id),
    submittedAt: new Date(r.submitted_at).toISOString(),
    totalFlags: r.total_flags,
    checkIn: r.check_in,
    notSureCount: r.not_sure_count,
    attemptedSections: r.attempted_sections ?? [],
    flagsBySection: r.flags_by_section ?? [],
    durationBySection: r.duration_by_section ?? [],
    itemsBySection: r.items_by_section ?? [],
  };
}

export async function saveSubmission(s: NewSubmission): Promise<void> {
  const sql = db();
  await sql`
    insert into assessment_submissions
      (email, submitted_at, check_in, total_flags, not_sure_count,
       attempted_sections, flags_by_section, duration_by_section, items_by_section)
    values
      (${normalizeEmail(s.email)}, ${s.submittedAt}, ${s.checkIn}, ${s.totalFlags}, ${s.notSureCount},
       ${JSON.stringify(s.attemptedSections)}::jsonb,
       ${JSON.stringify(s.flagsBySection)}::jsonb,
       ${JSON.stringify(s.durationBySection)}::jsonb,
       ${JSON.stringify(s.itemsBySection)}::jsonb)
  `;
}

/** Newest first. Capped: the progress view compares the latest few. */
export async function listSubmissions(email: string, limit = 50): Promise<SubmissionRecord[]> {
  const sql = db();
  const rows = (await sql`
    select id, submitted_at, total_flags, check_in, not_sure_count,
           attempted_sections, flags_by_section, duration_by_section, items_by_section
    from assessment_submissions
    where email = ${normalizeEmail(email)}
    order by submitted_at desc
    limit ${limit}
  `) as Row[];
  return rows.map(toRecord);
}

export async function countSubmissionsFor(email: string): Promise<number> {
  const sql = db();
  const rows = (await sql`
    select count(*)::int as n from assessment_submissions where email = ${normalizeEmail(email)}
  `) as { n: number }[];
  return rows[0]?.n ?? 0;
}

export async function countSubmissions(): Promise<number> {
  const sql = db();
  const rows = (await sql`select count(*)::int as n from assessment_submissions`) as { n: number }[];
  return rows[0]?.n ?? 0;
}
