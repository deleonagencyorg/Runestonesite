import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    type: z.enum([
      'residential',
      'multifamily',
      'commercial',
      'construction-management',
    ]),
    location: z.string(),
    year: z.number(),
    cover: z.string(),
    gallery: z.array(z.string()).default([]),
    summary: z.string(),
    featured: z.boolean().default(false),
    testimonial: z
      .object({
        quote: z.string(),
        author: z.string(),
        role: z.string(),
      })
      .optional(),
  }),
});

export const collections = { blog, projects };
