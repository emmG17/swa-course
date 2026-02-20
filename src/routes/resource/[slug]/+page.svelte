<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  function download() {
    const blob = new Blob([data.raw], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Lumina | {data.slug}</title>
</svelte:head>

<main class="max-w-4xl mx-auto px-6 py-12">
  <article class="prose dark:prose-invert max-w-none">
    {@html data.html}
  </article>
</main>

<button
  onclick={download}
  class="fixed bottom-8 right-8 flex items-center justify-center w-12 h-12 rounded-full bg-apple-green text-white shadow-lg hover:brightness-110 transition-all cursor-pointer"
  aria-label="Download markdown file"
>
  <span class="icon-[mdi--download] text-2xl"></span>
</button>
