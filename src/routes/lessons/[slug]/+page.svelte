<script lang="ts">
  import type { PageProps } from "./$types";
  import type { ResourceType } from "$lib/types";
  import { getLesson } from "$lib/lessons";

  let { params }: PageProps = $props();
  let lesson = $derived(getLesson(params.slug));

  let sidebarOpen = $state(true);

  const iconByType: Record<ResourceType, string> = {
    video: "icon-[mdi--video]",
    document: "icon-[mdi--file-document]",
    link: "icon-[mdi--open-in-new]",
    audio: "icon-[mdi--headphones]",
  };
</script>

{#if !lesson}
  <main class="max-w-5xl mx-auto px-6 py-12">
    <p class="text-label-secondary">Lesson not found.</p>
  </main>
{:else}
  <main class="flex flex-col h-[calc(100dvh-57px)] overflow-hidden px-6 py-6">
    <h1 class="text-3xl font-bold text-label-primary mb-4 shrink-0">{lesson.title}</h1>

    <div class="flex flex-1 min-h-0 gap-4 overflow-hidden">
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
          class="flex shrink-0 overflow-hidden transition-all duration-300 rounded-xl border border-separator bg-black/5 backdrop-blur-sm dark:bg-white/5 {sidebarOpen ? 'w-72' : 'w-14'}"
        >
          <div class="flex flex-col h-full w-full min-h-0 p-1.5">
            <!-- Toggle button -->
            <button
              onclick={() => sidebarOpen = !sidebarOpen}
              class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span class="icon-[mdi--chevron-right] text-xl text-label-secondary transition-transform duration-300 {sidebarOpen ? 'rotate-180' : ''}"></span>
            </button>

            <!-- Resource list -->
            <nav class="mt-2 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden min-h-0">
              {#if sidebarOpen}
                <h2 class="text-xs font-semibold text-label-secondary uppercase tracking-wide px-2 mb-1">Resources</h2>
              {/if}
              {#each lesson.resources as resource}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="relative flex items-center {sidebarOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-lg hover:bg-black/5 dark:hover:bg-white/10 hover:text-apple-green transition-colors group"
                  title={sidebarOpen ? undefined : resource.name}
                >
                  <span class="{iconByType[resource.type]} text-xl text-apple-green shrink-0"></span>
                  {#if sidebarOpen}
                    <span class="text-sm text-label-primary truncate group-hover:text-apple-green transition-colors">{resource.name}</span>
                  {:else}
                    <span class="pointer-events-none absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-bg-tertiary border border-separator text-sm text-label-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                      {resource.name}
                    </span>
                  {/if}
                </a>
              {/each}
            </nav>
          </div>
        </aside>
      {/if}
    </div>
  </main>
{/if}
