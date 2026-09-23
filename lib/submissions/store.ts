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

export type CheckInKind = 30 | 90;

export interface DueCheckIn {
  id: string;
  email: string;
  submittedAt: string;
}

/** Column that records each kind of check-in. Constants, never user input. */
const CHECKIN_COLUMN: Record<CheckInKind, string> = {
  30: "checkin_30_sent_at",
  90: "checkin_90_sent_at",
};

/** How long after the mark a check-in is still worth sending. Past this, skip it. */
const CHECKIN_WINDOW_DAYS: Record<CheckInKind, number> = { 30: 45, 90: 120 };

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

/**
 * Each address's latest opted-in submission that has crossed the 30-day or
 * 90-day mark, is still inside its sending window, and has not been mailed.
 * Only the latest row per address counts, so retaking the assessment restarts
 * the clock and an older row can never send a late 90-day email.
 */
export async function dueCheckIns(kind: CheckInKind, now = new Date()): Promise<DueCheckIn[]> {
  const sql = db();
  const rows = (await sql.query(
    `select id, email, submitted_at
       from (
         select distinct on (email) id, email, submitted_at, check_in,
                checkin_30_sent_at, checkin_90_sent_at
           from assessment_submissions
          order by email, submitted_at desc
       ) latest
      where check_in
        and submitted_at <= $1::timestamptz - make_interval(days => $2::int)
        and submitted_at >  $1::timestamptz - make_interval(days => $3::int)
        and ${CHECKIN_COLUMN[kind]} is null
      order by submitted_at asc
      limit 200`,
    [now.toISOString(), kind, CHECKIN_WINDOW_DAYS[kind]],
  )) as { id: string | number; email: string; submitted_at: string | Date }[];
  return rows.map((r) => ({
    id: String(r.id),
    email: r.email,
    submittedAt: new Date(r.submitted_at).toISOString(),
  }));
}

export async function markCheckInSent(id: string, kind: CheckInKind, at = new Date()): Promise<void> {
  const sql = db();
  await sql.query(`update assessment_submissions set ${CHECKIN_COLUMN[kind]} = $2 where id = $1`, [
    id,
    at.toISOString(),
  ]);
}

/** Turns check-ins off for every submission by this address. Returns rows changed. */
export async function stopCheckIns(email: string): Promise<number> {
  const sql = db();
  const rows = (await sql`
    update assessment_submissions set check_in = false
     where email = ${normalizeEmail(email)} and check_in
    returning id
  `) as { id: string | number }[];
  return rows.length;
}
