#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const homeSchema = z.object({
  profile: z.object({
    name: z.string(),
    headline: z.string(),
    short_tagline: z.string(),
    email: z.email(),
    linkedin_url: z.url(),
    github_url: z.url(),
    resume_url: z.string(),
    availability: z.string(),
    location: z.string(),
  }),
  hero: z.object({
    primary_cta: ctaSchema,
    secondary_cta: ctaSchema,
  }),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  about: z.array(z.string()).min(1),
  toolkit: z.array(
    z.object({ label: z.string(), items: z.array(z.string()).min(1) }),
  ),
  contact: z.object({
    intro: z.string(),
    primary_cta_label: z.string(),
  }),
}).superRefine((data, ctx) => {
  if ("sign_in" in data) {
    ctx.addIssue({
      code: "custom",
      message: "sign_in must not be present in public Pages content",
    });
  }
});

const experienceSchema = z.object({
  summary: z.object({ title: z.string() }),
  experience: z.record(
    z.string(),
    z.object({
      employer_name: z.string(),
      employer_duration: z.string(),
      roles: z.array(z.object({
        job_title: z.string(),
        duration: z.string(),
        headline: z.string(),
        highlights: z.array(z.string()),
      })).min(1),
    }),
  ),
});

const projectsSchema = z.object({
  summary: z.object({ title: z.string() }),
  projects: z.array(
    z.object({
      id: z.string(),
      tier: z.enum(["featured", "grid", "more"]).optional(),
      title: z.string(),
      description: z.string(),
      github_url: z.string(),
      demo_url: z.string(),
      technologies: z.array(z.string()),
    }),
  ).min(1),
});

function load(name, schema) {
  const file = path.join(ROOT, "src/content", name);
  if (!fs.existsSync(file)) {
    console.error(`check:content FAIL — missing ${name} (run npm run sync:portfolio)`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) {
    console.error(`check:content FAIL — ${name}`);
    console.error(result.error.toString());
    process.exit(1);
  }
  // Secret string scan
  const blob = JSON.stringify(raw);
  for (const needle of ["INSIGHTS_", "SECRET_KEY", "sign_in", "apprunner"]) {
    if (blob.includes(needle)) {
      console.error(`check:content FAIL — forbidden token "${needle}" in ${name}`);
      process.exit(1);
    }
  }
  console.log(`  ok ${name}`);
}

/** Every site-relative asset path in content must exist under public/. */
function checkAssetRefs() {
  const missing = [];
  const walk = (value, where) => {
    if (typeof value === "string") {
      if (/^\/(images|downloads)\//.test(value)) {
        const file = path.join(ROOT, "public", value);
        if (!fs.existsSync(file)) missing.push(`${where}: ${value}`);
      }
    } else if (Array.isArray(value)) {
      value.forEach((v) => walk(v, where));
    } else if (value && typeof value === "object") {
      Object.values(value).forEach((v) => walk(v, where));
    }
  };
  for (const name of ["home.json", "experience.json", "projects.json"]) {
    walk(JSON.parse(fs.readFileSync(path.join(ROOT, "src/content", name), "utf8")), name);
  }
  if (missing.length) {
    console.error("check:content FAIL — referenced assets missing from public/:");
    for (const m of missing) console.error(`  ${m}`);
    process.exit(1);
  }
  console.log("  ok asset references");
}

console.log("check:content");
load("home.json", homeSchema);
load("experience.json", experienceSchema);
load("projects.json", projectsSchema);
checkAssetRefs();
console.log("check:content OK");
