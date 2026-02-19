<script lang="ts">
  import type { PageProps } from "./$types";
  import { getLesson } from "$lib/lessons";

  let { params }: PageProps = $props();
  let lesson = $derived(getLesson(params.slug));
</script>

<main>
  {#if !lesson}
    <p>Lesson not found.</p>
  {:else}
    <h1>{lesson.title}</h1>
    <iframe
      src="/slides/{lesson.slug}/index.html"
      title={lesson.title}
    >
    </iframe>

  {/if}
</main>
