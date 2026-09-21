/**
 * Smoke test for lib/chat/red-flags.ts.
 * Runs the classifier against RED_FLAG_TEST_CASES and reports pass/fail.
 *
 *   npm exec --package=tsx -- tsx scripts/test-red-flags.ts
 */

import { classifyRedFlag, RED_FLAG_TEST_CASES } from "../lib/chat/red-flags";

let pass = 0;
let fail = 0;

console.log(`\nRED-FLAG CLASSIFIER SMOKE TEST — ${RED_FLAG_TEST_CASES.length} cases\n`);

for (const tc of RED_FLAG_TEST_CASES) {
  const result = classifyRedFlag(tc.message);
  const actualTier = result?.tier ?? null;
  const ok = actualTier === tc.expected;

  const badge = ok ? "PASS" : "FAIL";
  const arrow = ok ? "→" : "!!";
  console.log(
    `  ${badge}  ${arrow}  expected=${tc.expected ?? "null"}  actual=${actualTier ?? "null"}`,
  );
  console.log(`         "${tc.message}"`);
  console.log(`         (${tc.reason})`);
  if (!ok && result) console.log(`         matched: ${result.label} on "${result.matched}"`);
  console.log("");

  if (ok) pass++;
  else fail++;
}

console.log(`\nRESULT: ${pass} pass · ${fail} fail\n`);
if (fail > 0) process.exit(1);
