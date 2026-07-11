import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const i18nString = z.object({ en: z.string(), ja: z.string().optional() });

const biography = defineCollection({
  loader: file('./src/content/biography.yaml'),
  schema: z.object({
    category: z.enum(['affiliation', 'education']),
    order: z.number(),
    period: z.string(),
    title: i18nString,
    subtitle: i18nString.optional(),
  }),
});

const software = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/softwares' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    image: z.string(),
    imageWidthSideBySide: z.number().optional(),
    imageWidthStacked: z.number().optional(),
  }),
});

const licenses = defineCollection({
  loader: file('./src/content/licenses.yaml'),
  schema: z.object({
    section: z.enum(['licenses', 'certificates']),
    category: i18nString,
    items: z.array(z.object({
      name: i18nString,
      link: z.string().optional(),
      badge: z.string().optional(),
    })),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/works' }),
  schema: z.object({
    title: i18nString,
    order: z.number(),
    contentLayout: z.enum(['stacked', 'side-by-side']).optional(),
    logo: z.object({
      src: z.string(),
      height: z.string(),
    }).optional(),
    link: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      link: z.string().optional(),
    })).optional(),
    videos: z.array(z.string()).optional(),
    storeLinks: z.array(z.object({
      src: z.string(),
      link: z.string(),
      height: z.string(),
    })).optional(),
  }),
});

export const collections = { biography, software, licenses, works };
