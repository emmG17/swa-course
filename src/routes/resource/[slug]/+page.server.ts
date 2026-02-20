import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const filePath = resolve('src/content', `${params.slug}.md`);

  let raw: string;
  try {
    raw = await readFile(filePath, 'utf-8');
  } catch {
    error(404, 'Resource not found');
  }

  const html = await marked(raw);

  return { html, raw, slug: params.slug };
};
