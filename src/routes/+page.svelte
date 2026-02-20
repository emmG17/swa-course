<script lang="ts">
  import { getAllLessons } from "$lib/lessons";
  import LessonCard from "$lib/components/LessonCard.svelte";
  let lessons = getAllLessons();
</script>

<svelte:head>
  <title>Course</title>
</svelte:head>

<main class="max-w-4xl mx-auto px-6 py-12">
  <h1 class="text-3xl font-bold text-label-primary mb-8">Course Lessons</h1>

  <div class="grid gap-4">
    {#each lessons as lesson, i}
      <LessonCard {lesson} index={i} />
    {/each}
  </div>
</main>
