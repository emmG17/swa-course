import { readdir, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { join, resolve } from 'path';
import { $ } from 'bun';

const SLIDES_DIR = 'slides';
const MANIFEST_PATH = join(SLIDES_DIR, 'lessons.json');
const OUTPUT_DIR = 'static/slides';

interface LessonMeta {
  slug: string;
  title: string;
  description: string;
}

async function main() {
  // Read the slides directory
  const files = await readdir(SLIDES_DIR);

  // Filter in the md files in the slides directory
  const mdFiles = files.filter((file) => file.endsWith('.md'));

  // Create the manifest payload for the slides
  if (mdFiles.length === 0) {
    console.log('No markdown files found in the slides directory.');
    return;
  }

  console.log(`Found ${mdFiles.length} markdown files. Building slides...`);

  // Write the manifest to the slides directory (lessons.json)
  const lessonsPromises: Promise<LessonMeta>[] = mdFiles.map(async (file) => {
    const slug = file.replace('.md', '');
    const content = await readFile(join(SLIDES_DIR, file), 'utf-8');
    const { data } = matter(content);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
    } as LessonMeta;
  });

  const lessons = await Promise.all(lessonsPromises)
  lessons.sort((a, b) => a.slug.localeCompare(b.slug)); // Sort lessons by slug

  await writeFile(MANIFEST_PATH, JSON.stringify(lessons, null, 2), 'utf-8');
  console.log(`Generated manifest with ${lessons.length} lessons at ${MANIFEST_PATH}`);

  // Builds each slide into the output directory (sequentially to avoid memory issues)
  for (const lesson of lessons) {
    const input = resolve(SLIDES_DIR, `${lesson.slug}.md`);
    const output = resolve(OUTPUT_DIR, `${lesson.slug}`);
    const base = `/slides/${lesson.slug}/`;

    console.log(`Building slide: ${lesson.slug}`);
    
    await $`bunx slidev build ${input} --out ${output} --base ${base}`;

    console.log(`Built slide: ${lesson.slug} -> ${output}`);
  }

  console.log('All slides built successfully.');
}

main().catch((error) => {
  console.error('Error building slides:', error);
  process.exit(1);
});
