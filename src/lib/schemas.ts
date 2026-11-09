import { z } from "zod";

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const homeSchema = z.object({
  profile: z.object({
    name: z.string(),
    headline: z.string(),
    short_tagline: z.string(),
    current_role: z.string().optional(),
    email: z.email(),
    linkedin_url: z.url(),
    github_url: z.url(),
    medium_url: z.string().optional(),
    resume_url: z.string(),
    availability: z.string(),
    location: z.string(),
  }),
  hero: z.object({
    primary_cta: ctaSchema,
    secondary_cta: ctaSchema,
    chart_caption: z.string().optional(),
  }),
  stats: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  proof_logos: z.array(
    z.object({
      name: z.string(),
      src: z.string(),
    }),
  ),
  about: z.array(z.string()).min(1),
  facts: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
  toolkit: z.array(
    z.object({
      label: z.string(),
      items: z.array(z.string()).min(1),
    }),
  ),
  contact: z.object({
    intro: z.string(),
    primary_cta_label: z.string(),
  }),
  seo: z
    .object({
      meta_title: z.string(),
      meta_description: z.string(),
    })
    .optional(),
});

const roleSchema = z.object({
  job_title: z.string(),
  duration: z.string(),
  headline: z.string(),
  highlights: z.array(z.string()),
});

export const experienceSchema = z.object({
  summary: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
  }),
  experience: z.record(
    z.string(),
    z.object({
      employer_name: z.string(),
      employer_duration: z.string(),
      location: z.string().optional(),
      logo: z.string().optional(),
      roles: z.array(roleSchema).min(1),
    }),
  ),
});

export const projectSchema = z.object({
  id: z.string(),
  /** featured: large rows; grid: cards; more: compact text list. */
  tier: z.enum(["featured", "grid", "more"]).default("grid"),
  title: z.string(),
  tagline: z.string().optional(),
  description: z.string(),
  impact: z.string().default(""),
  engineering: z.string().optional(),
  /** Still image, or the poster frame when `video` is set. */
  image: z.string().default(""),
  video: z.string().optional(),
  /** Inline SVG figure rendered instead of an image. */
  figure: z.enum(["platform", "agent", "recs"]).optional(),
  /** "browser" wraps the media in a browser bar showing the demo domain. */
  frame: z.enum(["browser", "plain"]).default("plain"),
  alt: z.string().optional(),
  github_url: z.string(),
  demo_url: z.string(),
  demo_label: z.string().optional(),
  technologies: z.array(z.string()),
  // Legacy fields still emitted by sync-from-portfolio; not rendered.
  category: z.string().optional(),
  engagement_type: z.string().optional(),
  logo_text: z.string().optional(),
  accent: z.string().optional(),
  demo_links: z
    .array(
      z.object({
        url: z.string(),
        label: z.string(),
        title: z.string().optional(),
      }),
    )
    .optional(),
});

export const projectsSchema = z.object({
  summary: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
  }),
  projects: z.array(projectSchema).min(1),
});
