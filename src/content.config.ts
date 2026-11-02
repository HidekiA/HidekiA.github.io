import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const i18nString = z.object({ en: z.string(), ja: z.string().optional() });

const biography = defineCollection({
  loader: file('./src/content/biography.yaml'),
  schema: z.object({
    category: z.enum(['affiliation', 'education']),
    order: z.number(),
    // 文字列（両言語共通）または { en, ja }（例: "2022-present" / "2022-現在"）
    period: z.union([z.string(), i18nString]).transform((p) => (typeof p === 'string' ? { en: p } : p)),
    title: i18nString,
    subtitle: i18nString.optional(),
    // 直前の項目と年号の背景色を連結して表示する（同一組織での連続を示す）
    connected: z.boolean().optional(),
  }),
});

const software = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/softwares' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
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
      width: z.string().optional(),
    }).optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      link: z.string().optional(),
      width: z.string().optional(),
    })).optional(),
    videos: z.array(z.string()).optional(),
    storeLinks: z.array(z.object({
      src: z.string(),
      link: z.string(),
      height: z.string(),
      alt: z.string().optional(),
    })).optional(),
    // アプリアイコン等の正方形タイル（横4列、狭い画面では2列）。リンク先と alt は言語別
    icons: z.array(z.object({
      src: z.string(),
      alt: i18nString,
      link: i18nString,
    })).optional(),
  }),
});

export const collections = { biography, software, licenses, works };
