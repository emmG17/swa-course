<script lang="ts">
  import type { PageProps } from "./$types";
  import { getLesson } from "$lib/lessons";

  let { params }: PageProps = $props();
  let lesson = $derived(getLesson(params.slug));
</script>

<main class="max-w-5xl mx-auto px-6 py-12">
  {#if !lesson}
    <p class="text-label-secondary">Lesson not found.</p>
  {:else}
    <h1 class="text-3xl font-bold text-label-primary mb-6">{lesson.title}</h1>
    <div class="rounded-xl overflow-hidden border border-separator bg-bg-secondary">
      <iframe
        src="/slides/{lesson.slug}/index.html"
        title={lesson.title}
        class="w-full aspect-video"
      >
      </iframe>
    </div>
  {/if}
</main>
