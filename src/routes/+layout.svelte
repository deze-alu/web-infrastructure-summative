<script lang="ts">
	import favicon from '#lib/assets/favicon.svg'
	import { createTheme } from '#lib/stores/theme.svelte.ts'
	import type { LayoutProps } from './$types'

	import '#lib/assets/app.css'
	import { onMount } from 'svelte'

	const theme = createTheme()

	onMount(() => theme.initialize())

	let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
