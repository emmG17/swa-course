import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

const contentFiles = import.meta.glob('/src/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

export const load: PageServerLoad = async ({ params }) => {
  const key = `/src/content/${params.slug}.md`;
  const raw = contentFiles[key];

  if (!raw) {
    error(404, 'Resource not found');
  }

  const html = await marked(raw);

  return { html, raw, slug: params.slug };
};
