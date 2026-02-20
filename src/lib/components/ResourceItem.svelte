<script lang="ts">
  import type { LessonResource } from "$lib/types";

  interface Props {
    resource: LessonResource;
    sidebarOpen: boolean;
  }

  let { resource, sidebarOpen }: Props = $props();

  let isDocument = $derived(resource.type === "document");
  let href = $derived(isDocument ? `/resource/${resource.url.replace(/\.[^.]+$/, '')}` : resource.url);

  const iconByType: Record<string, string> = {
    video: "icon-[mdi--video]",
    document: "icon-[mdi--file-document]",
    link: "icon-[mdi--open-in-new]",
    audio: "icon-[mdi--headphones]",
  };
</script>

<a
  href={href}
  target={isDocument ? undefined : "_blank"}
  rel={isDocument ? undefined : "noopener noreferrer"}
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
