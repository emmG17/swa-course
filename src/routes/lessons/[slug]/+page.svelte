<script lang="ts">
  import type { PageProps } from "./$types";
  import { getLesson } from "$lib/lessons";
  import ResourceItem from "$lib/components/ResourceItem.svelte";

  const SM_BREAKPOINT = 640; // Tailwind's sm breakpoint in pixels 

  let { params }: PageProps = $props();
  let lesson = $derived(getLesson(params.slug));
  let title = $derived.by(() => {
    let lesson = getLesson(params.slug);
    return lesson ? lesson.title : "Lesson Not Found";
  });

  let sidebarOpen = $state(typeof window !== 'undefined' && window.innerWidth <= SM_BREAKPOINT);
</script>

<svelte:head>
  <title>Lumina | {title}</title>
</svelte:head>

{#if !lesson}
  <main class="max-w-5xl mx-auto px-6 py-12">
    <p class="text-label-secondary">Lesson not found.</p>
  </main>
{:else}
  <main class="flex flex-col h-[90dvh] overflow-hidden px-6 py-6">
    <h1 class="text-3xl font-bold text-label-primary mb-4 shrink-0">{lesson.title}</h1>

    <div class="flex flex-col md:flex-row flex-1 min-h-0 h-full gap-4 overflow-hidden">
      <!-- Iframe -->
      <div class="flex-1 min-w-0 rounded-xl overflow-hidden border border-separator bg-bg-secondary">
        <iframe
          src="/slides/{lesson.slug}/index.html"
          title={lesson.title}
          class="w-full h-full"
        ></iframe>
      </div>

      <!-- Sidebar -->
      {#if lesson.resources && lesson.resources.length > 0}
        <aside
          class="flex shrink-0 overflow-hidden transition-all duration-300 rounded-xl border border-separator bg-black/5 backdrop-blur-sm dark:bg-white/5 {sidebarOpen ? 'w-full sm:w-72' : 'w-14'}"
        >
          <div class="flex flex-col h-full w-full min-h-0 p-1.5">
            <!-- Toggle button -->
            <button
              onclick={() => sidebarOpen = !sidebarOpen}
              class="flex hidden sm:block items-center justify-center w-9 h-9 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span class="icon-[mdi--chevron-left] text-xl text-label-secondary transition-transform duration-300 {sidebarOpen ? 'rotate-180' : ''}"></span>
            </button>
            <!-- Resource list -->
            <nav class="mt-2 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden min-h-0">
              {#if sidebarOpen}
                <h2 class="text-xs font-semibold text-label-secondary uppercase tracking-wide px-2 mb-1">Resources</h2>
              {/if}
              {#each lesson.resources as resource}
                <ResourceItem {resource} {sidebarOpen} />
              {/each}
            </nav>
          </div>
        </aside>
      {/if}
    </div>
  </main>
{/if}
