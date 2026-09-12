#!/usr/bin/env node
/** Fail if any public asset exceeds 2048 KB. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const LIMIT = 2048 * 1024;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const oversized = [];
for (const file of walk(PUBLIC)) {
  const size = fs.statSync(file).size;
  if (size > LIMIT) {
    oversized.push({
      file: path.relative(ROOT, file),
      kb: Math.round(size / 1024),
    });
  }
}

if (oversized.length) {
  console.error("check:assets FAIL — files exceed 2048 KB:");
  for (const row of oversized) {
    console.error(`  ${row.file} (${row.kb} KB)`);
  }
  process.exit(1);
}

console.log("check:assets OK (all public files ≤ 2048 KB)");
