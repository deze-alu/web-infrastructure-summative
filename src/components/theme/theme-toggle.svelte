<script lang="ts">
	import { Classic } from '@theme-toggles/svelte'
	import '@theme-toggles/svelte/styles/classic.css'
	import { theme } from '#lib/stores/theme.svelte.ts'
	const toggled = $derived(theme.currentTheme === 'light')
	$effect(() => {
		console.log(toggled)
	})
</script>

<Classic class="cursor-pointer" {toggled} on:click={theme.toggleTheme} />
