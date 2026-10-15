#!/usr/bin/env node
/**
 * Fail if git is tracking browser-profile / telemetry files.
 * This repo is a public personal site: tracked === published.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN_PREFIXES = [
  ".brave-shot/",
  ".chrome-shot/",
  ".chromium-user-data/",
  ".playwright-profile/",
  ".puppeteer-profile/",
];

const FORBIDDEN_BASENAMES = new Set([
  "Local State",
  "TransportSecurity",
  "Network Persistent State",
  "Cookies",
  "Cookies-journal",
  "Login Data",
  "Login Data-journal",
]);

function trackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    return out.split("\0").filter(Boolean);
  } catch {
    console.log("check:privacy SKIP (not a git checkout)");
    process.exit(0);
  }
}

function isForbidden(rel) {
  const normalized = rel.replaceAll("\\", "/");
  if (FORBIDDEN_PREFIXES.some((p) => normalized === p.slice(0, -1) || normalized.startsWith(p))) {
    return true;
  }
  return FORBIDDEN_BASENAMES.has(path.posix.basename(normalized));
}

const hits = trackedFiles().filter(isForbidden);
if (hits.length) {
  console.error("check:privacy FAIL — tracked files would publish browser/profile state:");
  for (const file of hits) console.error(`  ${file}`);
  console.error("Remove them from git and keep the directory in .gitignore.");
  process.exit(1);
}

console.log("check:privacy OK (no browser-profile files tracked)");
