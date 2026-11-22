/**
 * Measure how often Chromi agrees with professional colour analysts.
 *
 *   npm run validate -- path/to/results.csv
 *
 * CSV columns (header row required; see scripts/validation-template.csv):
 *   tester       any label
 *   chromi_link  the studio or results URL after the tester set up their profile
 *   pro_season   the season a professional analyst gave them, e.g. "Soft Autumn"
 *
 * Reports exact agreement, top-3 agreement, same-family agreement and the most
 * common disagreements, so you know what to recalibrate.
 */

import { readFileSync } from "node:fs";
import { analyse } from "@/lib/analysis";
import { profileFromSearchParams } from "@/lib/profile";
import { seasons, type Season } from "@/lib/seasons";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows;
}

/** Accepts ids or names, plus common synonyms from 12-season systems. */
function findSeason(input: string): Season | undefined {
  const key = input
    .trim()
    .toLowerCase()
    .replace(/\bdeep\b/, "dark")
    .replace(/\bclear\b/, "bright")
    .replace(/[^a-z]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return seasons.find((s) => s.id === key || s.name.toLowerCase().replace(/\s+/g, "-") === key);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run validate -- results.csv");
  process.exit(1);
}

const [header, ...rows] = parseCsv(readFileSync(file, "utf8"));
const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
const [iTester, iLink, iPro] = [col("tester"), col("chromi_link"), col("pro_season")];
if (iLink < 0 || iPro < 0) {
  console.error("CSV needs chromi_link and pro_season columns");
  process.exit(1);
}

let n = 0;
let exact = 0;
let top3 = 0;
let family = 0;
const misses = new Map<string, number>();

for (const r of rows) {
  const label = (iTester >= 0 ? r[iTester] : "") || `row ${n + 2}`;
  const pro = findSeason(r[iPro] ?? "");
  if (!pro) {
    console.warn(`skip ${label}: unknown pro_season "${r[iPro]}"`);
    continue;
  }
  let query = "";
  try {
    query = new URL((r[iLink] ?? "").trim()).search;
  } catch {
    console.warn(`skip ${label}: chromi_link is not a URL`);
    continue;
  }
  const sp = Object.fromEntries(new URLSearchParams(query));
  if (!sp.m) {
    console.warn(`skip ${label}: link has no profile (open the studio, set up, copy the URL)`);
    continue;
  }
  const a = analyse(profileFromSearchParams(sp));
  const ranked = a.matches.map((m) => m.season.id);
  n++;
  if (ranked[0] === pro.id) exact++;
  if (ranked.slice(0, 3).includes(pro.id)) top3++;
  if (a.top.season.family === pro.family) family++;
  if (ranked[0] !== pro.id) {
    const k = `pro ${pro.name} → Chromi ${a.top.season.name}`;
    misses.set(k, (misses.get(k) ?? 0) + 1);
  }
  console.log(
    `${label.padEnd(16)} pro: ${pro.name.padEnd(14)} chromi: ${a.top.season.name.padEnd(14)} ${
      ranked[0] === pro.id ? "✓" : ranked.slice(0, 3).includes(pro.id) ? "top-3" : "✗"
    }`
  );
}

if (!n) {
  console.error("No usable rows.");
  process.exit(1);
}
const pct = (x: number) => `${Math.round((100 * x) / n)}%`;
console.log(`\n${n} testers`);
console.log(`exact season  ${pct(exact)}  (${exact}/${n})`);
console.log(`within top 3  ${pct(top3)}  (${top3}/${n})`);
console.log(`same family   ${pct(family)}  (${family}/${n})`);
if (n < 20) console.log("Fewer than 20 testers: treat these numbers as rough.");
if (misses.size) {
  console.log("\nMost common disagreements:");
  [...misses.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([k, v]) => console.log(`  ${v} × ${k}`));
}
