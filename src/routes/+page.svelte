<script lang="ts">
  import { getAllLessons } from "$lib/lessons";
  let lessons = getAllLessons();
</script>

<svelte:head>
  <title>Course</title>
</svelte:head>

<main>
  <h1>Course Lessons</h1>

  <div>
    {#each lessons as lesson, i}
      <a href="lessons/{lesson.slug}">
        <span class="lesson-number">Lesson {i + 1}</span>
        <h2>{lesson.title}</h2>
        {#if lesson.description}
          <p>{lesson.description}</p>
        {/if}
      </a>
    {/each}
  </div>
</main>
