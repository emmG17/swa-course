import type { Manifest, LessonMeta } from "./types";
import manifest from "./lessons.json";

export const lessons: Manifest = manifest;

export function getLesson(slug: string): LessonMeta | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getAllLessons(): LessonMeta[] {
  return lessons;
}

export function getLessonIndex(slug: string): number {
  return lessons.findIndex((lesson) => lesson.slug === slug);
}

export function getNextLesson(slug: string): LessonMeta | undefined {
  const index = getLessonIndex(slug);
  if (index === -1 || index === lessons.length - 1) {
    return undefined; // No next lesson
  }
  return lessons[index + 1];
}
