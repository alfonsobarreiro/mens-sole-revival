-- Assessment submissions. Applied by scripts/db-migrate.mts (idempotent).
-- One row per completed assessment that the visitor chose to email to
-- themselves. Health answers live only here, behind DATABASE_URL.

create table if not exists assessment_submissions (
  id                  bigserial primary key,
  email               text        not null,
  submitted_at        timestamptz not null,
  check_in            boolean     not null default false,
  total_flags         integer     not null default 0,
  not_sure_count      integer     not null default 0,
  attempted_sections  jsonb       not null default '[]'::jsonb,
  flags_by_section    jsonb       not null default '[]'::jsonb,
  duration_by_section jsonb       not null default '[]'::jsonb,
  items_by_section    jsonb       not null default '[]'::jsonb,
  created_at          timestamptz not null default now()
);

-- The progress view reads one email's history, newest first.
create index if not exists assessment_submissions_email_submitted_idx
  on assessment_submissions (email, submitted_at desc);
