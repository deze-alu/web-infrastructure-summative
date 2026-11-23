<script lang="ts">
	import '#lib/assets/app.css'

	import favicon from '#lib/assets/favicon.svg'
	import { theme } from '#lib/stores/theme.svelte.ts'
	import type { LayoutProps } from './$types'
	import { onMount } from 'svelte'

	onMount(() => theme.initialize())

	let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />

	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />

	<link
		href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
