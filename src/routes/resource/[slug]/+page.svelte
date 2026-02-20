<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Lumina | {data.slug}</title>
</svelte:head>

<main class="max-w-4xl mx-auto px-6 py-12">
  <article class="prose dark:prose-invert max-w-none">
    {@html data.html}
  </article>
</main>
