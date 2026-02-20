<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import animatedLogo from '$lib/assets/lumina-animated.svg';
	import { theme } from '$lib/theme.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Lava lamp background -->
<div class="lava-lamp" aria-hidden="true">
  <div class="lava-blob lava-blob-1"></div>
  <div class="lava-blob lava-blob-2"></div>
  <div class="lava-blob lava-blob-3"></div>
  <div class="lava-blob lava-blob-4"></div>
  <div class="lava-blob lava-blob-5"></div>
</div>

<nav class="flex items-center justify-between px-6 py-4 border-b border-separator bg-bg-primary">
  <a href="/" class="flex items-center gap-2 text-lg font-semibold text-label-primary hover:text-apple-green transition-colors">
    <img src={animatedLogo} alt="" class="inline-block w-8 h-8 ml-1" />
    Lumina
  </a>
  <button
    onclick={() => theme.toggle()}
    class="p-2 rounded-lg hover:bg-bg-secondary transition-colors text-label-primary"
    aria-label="Toggle theme"
  >
    {#if theme.mode === 'system'}
      <!-- Monitor icon for system mode -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    {:else if theme.mode === 'light'}
      <!-- Sun icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    {:else}
      <!-- Moon icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    {/if}
  </button>
</nav>

{@render children()}
