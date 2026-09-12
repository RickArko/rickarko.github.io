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
    email: z.string().email(),
    linkedin_url: z.string().url(),
    github_url: z.string().url(),
    medium_url: z.string().optional(),
    availability: z.string(),
    location: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subheadline: z.string().optional(),
    primary_cta: ctaSchema,
    secondary_cta: ctaSchema,
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
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    }),
  ),
  expertise: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  wins: z.array(
    z.object({
      title: z.string(),
      impact: z.string(),
      summary: z.string(),
    }),
  ),
  engagements: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  contact: z.object({
    intro: z.string(),
    primary_cta_label: z.string(),
    fit_eyebrow: z.string().optional(),
    channels: z.array(z.record(z.string(), z.unknown())),
  }),
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
      logo: z.string().optional(),
      roles: z.array(roleSchema).min(1),
    }),
  ),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  engagement_type: z.string(),
  description: z.string(),
  impact: z.string(),
  image: z.string(),
  logo_text: z.string(),
  accent: z.string(),
  github_url: z.string(),
  demo_url: z.string(),
  demo_label: z.string().optional(),
  demo_links: z
    .array(
      z.object({
        url: z.string(),
        label: z.string(),
        title: z.string().optional(),
      }),
    )
    .optional(),
  technologies: z.array(z.string()),
});

export const projectsSchema = z.object({
  summary: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
  }),
  projects: z.array(projectSchema).min(1),
});
