import homeJson from "../content/home.json";
import experienceJson from "../content/experience.json";
import projectsJson from "../content/projects.json";
import { experienceSchema, homeSchema, projectsSchema } from "./schemas";
import type { z } from "zod";

export type Home = z.infer<typeof homeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Projects = z.infer<typeof projectsSchema>;

export const home: Home = homeSchema.parse(homeJson);
export const experience: Experience = experienceSchema.parse(experienceJson);
export const projects: Projects = projectsSchema.parse(projectsJson);

export function sortedEmployers(exp: Experience) {
  return Object.entries(exp.experience)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, entry]) => entry);
}

export function skillGroups(h: Home) {
  return {
    expertise: h.expertise,
    technologies: h.toolkit,
  };
}
