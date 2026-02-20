<script lang="ts">
  import type { LessonMeta } from "$lib/types";

  let { lesson, index }: { lesson: LessonMeta; index: number } = $props();
</script>

<a
  href="lessons/{lesson.slug}"
  class="flex gap-5 p-6 rounded-xl bg-bg-secondary border border-separator hover:border-apple-green transition-colors group"
>
  {#if lesson.image}
    <div class="shrink-0 w-28 h-28 rounded-lg overflow-hidden bg-bg-tertiary">
      <img src={lesson.image} alt={lesson.title} class="w-full h-full object-cover" />
    </div>
  {/if}
  <div class="flex flex-col justify-center min-w-0">
    <span class="text-sm font-medium text-apple-green">Lesson {index + 1}</span>
    <h2 class="text-xl font-semibold text-label-primary mt-1 group-hover:text-apple-green transition-colors">
      {lesson.title}
    </h2>
    {#if lesson.description}
      <p class="text-label-secondary mt-2">{lesson.description}</p>
    {/if}
  </div>
</a>
