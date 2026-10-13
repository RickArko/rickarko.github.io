#!/usr/bin/env node
/**
 * Allowlisted sync from ../Portfolio into this Pages repo.
 * Refuses secrets, deployment/, work.json, and gated assets.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORTFOLIO = path.resolve(ROOT, "../Portfolio");

const FORBIDDEN_BASENAMES = new Set([
  "work.json",
  ".env",
  ".env.example",
  ".env.local",
  ".env.production",
]);

const FORBIDDEN_DIR_PARTS = ["deployment", "node_modules", ".git", ".venv"];

function die(msg) {
  console.error(`sync:portfolio ERROR: ${msg}`);
  process.exit(1);
}

function assertSafeSource(absPath) {
  const rel = path.relative(PORTFOLIO, absPath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    die(`refusing path outside Portfolio: ${absPath}`);
  }
  const parts = rel.split(path.sep);
  if (parts.some((p) => FORBIDDEN_DIR_PARTS.includes(p))) {
    die(`refusing forbidden directory in path: ${rel}`);
  }
  if (FORBIDDEN_BASENAMES.has(path.basename(absPath))) {
    die(`refusing forbidden file: ${rel}`);
  }
  if (path.basename(absPath).startsWith(".env")) {
    die(`refusing env file: ${rel}`);
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  assertSafeSource(src);
  if (!fs.existsSync(src)) die(`missing source: ${src}`);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`  copy ${path.relative(PORTFOLIO, src)} → ${path.relative(ROOT, dest)}`);
}

function rewriteStaticPath(p) {
  if (!p || typeof p !== "string") return "";
  // /static/images/... → /images/...
  // /static/project-logos/... → /images/project-logos/...
  // images/logos/... → /images/logos/...
  let out = p;
  if (out.startsWith("/static/")) out = out.slice("/static".length);
  if (out.startsWith("static/")) out = out.slice("static/".length);
  if (!out.startsWith("/")) out = `/${out}`;
  if (out.startsWith("/project-logos/")) {
    out = `/images${out}`;
  }
  return out;
}

function assetBasenameFromImagePath(imagePath) {
  const rewritten = rewriteStaticPath(imagePath);
  return path.basename(rewritten);
}

if (!fs.existsSync(PORTFOLIO)) {
  die(`Portfolio not found at ${PORTFOLIO}`);
}

console.log("sync:portfolio from", PORTFOLIO);

const homeRaw = JSON.parse(
  fs.readFileSync(path.join(PORTFOLIO, "src/db/home.json"), "utf8"),
);
assertSafeSource(path.join(PORTFOLIO, "src/db/home.json"));
const { sign_in: _omitSignIn, insights: _omitInsights, ...homeRest } = homeRaw;
const localHomePath = path.join(ROOT, "src/content/home.json");
let localToolkit = [];
if (fs.existsSync(localHomePath)) {
  try {
    const localHome = JSON.parse(fs.readFileSync(localHomePath, "utf8"));
    if (Array.isArray(localHome.toolkit)) localToolkit = localHome.toolkit;
  } catch {
    // Pages-only toolkit is optional until home.json exists
  }
}
const home = {
  ...homeRest,
  proof_logos: (homeRaw.proof_logos || []).map((logo) => ({
    ...logo,
    src: rewriteStaticPath(logo.src),
  })),
  hero: {
    ...homeRaw.hero,
    primary_cta: { label: "See Experience", href: "#experience" },
    secondary_cta: { label: "Get in Touch", href: "#contact" },
  },
  // Pages-only curated list; keep local if Portfolio has none
  toolkit: Array.isArray(homeRaw.toolkit) && homeRaw.toolkit.length
    ? homeRaw.toolkit
    : localToolkit,
};

const experienceRaw = JSON.parse(
  fs.readFileSync(path.join(PORTFOLIO, "src/db/experience.json"), "utf8"),
);
assertSafeSource(path.join(PORTFOLIO, "src/db/experience.json"));
const experience = {
  summary: experienceRaw.summary,
  experience: Object.fromEntries(
    Object.entries(experienceRaw.experience || {}).map(([id, entry]) => [
      id,
      {
        ...entry,
        logo: entry.logo ? rewriteStaticPath(entry.logo) : undefined,
      },
    ]),
  ),
};

const projectsRaw = JSON.parse(
  fs.readFileSync(path.join(PORTFOLIO, "src/db/projects.json"), "utf8"),
);
assertSafeSource(path.join(PORTFOLIO, "src/db/projects.json"));

const visibleProjects = Object.entries(projectsRaw.projects || {})
  .filter(([, p]) => p.visible === true)
  .map(([id, p]) => {
    const image = rewriteStaticPath(p.image || "");
    return {
      id,
      title: p.title,
      category: p.category || "",
      engagement_type: p.engagement_type || "",
      description: p.description,
      impact: p.impact || "",
      image,
      logo_text: p.logo_text || "",
      accent: p.accent || "#334155",
      github_url: p.github_url || "",
      demo_url: p.demo_url || "",
      demo_label: p.demo_label || "Demo",
      demo_links: Array.isArray(p.demo_links) ? p.demo_links : [],
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
    };
  });

const projects = {
  summary: projectsRaw.summary,
  projects: visibleProjects,
};

const contentDir = path.join(ROOT, "src/content");
ensureDir(contentDir);
fs.writeFileSync(path.join(contentDir, "home.json"), `${JSON.stringify(home, null, 2)}\n`);
fs.writeFileSync(
  path.join(contentDir, "experience.json"),
  `${JSON.stringify(experience, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(contentDir, "projects.json"),
  `${JSON.stringify(projects, null, 2)}\n`,
);
console.log("  wrote src/content/{home,experience,projects}.json");

// Core assets
copyFile(
  path.join(PORTFOLIO, "src/static/images/profile-image.png"),
  path.join(ROOT, "public/images/profile-image.png"),
);
copyFile(
  path.join(PORTFOLIO, "src/static/favicon.ico"),
  path.join(ROOT, "public/favicon.ico"),
);
copyFile(
  path.join(PORTFOLIO, "src/static/images/logos/shipbob-logo.jpeg"),
  path.join(ROOT, "public/images/logos/shipbob-logo.jpeg"),
);
copyFile(
  path.join(PORTFOLIO, "src/static/images/logos/coyote-logistics-logo.jpg"),
  path.join(ROOT, "public/images/logos/coyote-logistics-logo.jpg"),
);
copyFile(
  path.join(PORTFOLIO, "src/static/downloads/resume-generic-media.pdf"),
  path.join(ROOT, "public/downloads/resume-generic-media.pdf"),
);
copyFile(
  path.join(PORTFOLIO, "src/static/downloads/resume-no-media.pdf"),
  path.join(ROOT, "public/downloads/resume-no-media.pdf"),
);

// Visible project media only
for (const project of visibleProjects) {
  if (!project.image) continue;
  const basename = assetBasenameFromImagePath(project.image);
  // Resolve original under Portfolio static
  const candidates = [
    path.join(PORTFOLIO, "src/static", project.image.replace(/^\//, "")),
    path.join(PORTFOLIO, "src/static/images/project-logos", basename),
    path.join(PORTFOLIO, "src/static/project-logos", basename),
  ];
  const src = candidates.find((c) => fs.existsSync(c));
  if (!src) {
    console.warn(`  WARN missing media for ${project.id}: ${project.image}`);
    continue;
  }
  const dest = path.join(ROOT, "public", project.image.replace(/^\//, ""));
  copyFile(src, dest);
}

console.log("sync:portfolio done.");
