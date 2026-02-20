export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

export type Manifest = LessonMeta[];
