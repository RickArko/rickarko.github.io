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
    email: z.string().email(),
    linkedin_url: z.string().url(),
    github_url: z.string().url(),
    availability: z.string(),
    location: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    primary_cta: ctaSchema,
    secondary_cta: ctaSchema,
  }),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  about: z.array(z.string()).min(1),
  expertise: z.array(z.object({ title: z.string(), description: z.string() })),
  wins: z.array(
    z.object({ title: z.string(), impact: z.string(), summary: z.string() }),
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
      title: z.string(),
      description: z.string(),
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

console.log("check:content");
load("home.json", homeSchema);
load("experience.json", experienceSchema);
load("projects.json", projectsSchema);
console.log("check:content OK");
