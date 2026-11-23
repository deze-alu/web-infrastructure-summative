<!-- Entry point of the application -->
<script lang="ts">
	import type { PageProps } from './$types'
	import Navigation from '#components/navigation/navigation.svelte'
	import GameBoard from '#components/game/gameBoard.svelte'

	const { data }: PageProps = $props()
	const wordOfTheDay = $derived(data.solution)
</script>

<div class="w-full max-w-6xl m-auto!">
	<Navigation />
	<!-- Hero Help Area -->
	<div class="container w-full justify-center text-center pt-10">
		<p class="text-(--text-secondary) text-[12px] font-semibold flex justify-center gap-3">
			<span class="uppercase tracking-wider mr-1 block">Daily Puzzle</span> <span>/</span>
			<span class="block ml-1">No. 328</span>
		</p>
		<p class="font-semibold text-4xl mt-2">A little wordplay.</p>
		<p class="font-semibold text-(--text-secondary) mt-2 text-[14px]">
			One word. Six guesses. Make them count.
		</p>
	</div>
	<GameBoard {wordOfTheDay} />
</div>
