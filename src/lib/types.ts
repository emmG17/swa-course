export type ResourceType = 'video' | 'document' | 'link' | 'audio';

export interface LessonResource {
  url: string;
  name: string;
  type: ResourceType;
}

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  image?: string;
  resources?: LessonResource[];
}

export type Manifest = LessonMeta[];
