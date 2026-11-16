<!-- Entry point of the application -->
<script lang="ts">
	import type { PageProps } from './$types'
	import Navigation from '#components/navigation/navigation.svelte'

	const { data }: PageProps = $props()
	const wordOfTheDay = $derived(data.solution)

	$effect(() => {
		console.log(data.solution)
	})
</script>

<Navigation />
<p>{wordOfTheDay}</p>
