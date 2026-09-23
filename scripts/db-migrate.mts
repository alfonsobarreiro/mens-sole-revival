/**
 * Applies lib/submissions/schema.sql to the database in DATABASE_URL.
 * Idempotent: every statement is "create ... if not exists".
 *
 *   node --env-file=.env.local scripts/db-migrate.mts
 *
 * Run once against the Neon database after creating it, and again whenever
 * schema.sql changes. Vercel does not run this; it is a one-off from a laptop.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Put the Neon connection string in .env.local first.");
  process.exit(1);
}

const sql = neon(url);
const file = join(process.cwd(), "lib", "submissions", "schema.sql");
const statements = readFileSync(file, "utf8")
  .split(/;\s*\n/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log("ok:", statement.split("\n")[0].slice(0, 72));
}

const [{ n }] = (await sql.query("select count(*)::int as n from assessment_submissions")) as { n: number }[];
console.log(`assessment_submissions ready, ${n} row(s)`);
