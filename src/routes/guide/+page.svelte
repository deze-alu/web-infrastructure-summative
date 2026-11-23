<script lang="ts">
	import Navigation from '#components/navigation/navigation.svelte'

	const examples = [
		{
			word: 'PLANT',
			highlightedIndex: 0,
			status: 'correct',
			title: 'Right letter, right spot',
			description: 'P is in the word and in the correct position',
		},
		{
			word: 'TABLE',
			highlightedIndex: 1,
			status: 'present',
			title: 'Right letter, wrong spot.',
			description: 'A is in the word, but belongs somewhere else',
		},
		{
			word: 'GHOST',
			highlightedIndex: 3,
			status: 'absent',
			title: 'Not in the word.',
			description: 'S isn’t in the word. Try a different letter.',
		},
	] as const

	const statusClasses = {
		correct: 'bg-(--feedback-correct) border-(--feedback-correct) text-white',
		present: 'bg-(--feedback-present) border-(--feedback-present) text-white',
		absent: 'bg-(--feedback-absent) border-(--feedback-absent) text-white',
	}
</script>

<div class="min-h-screen bg-(--background) text-(--text) flex flex-col">
	<div class="w-full max-w-6xl mx-auto sm:px-6 px-4 flex-1">
		<Navigation />

		<main class="w-full max-w-[656px] mx-auto pt-12 sm:pt-10 pb-16">
			<section class="text-center">
				<p class="text-[11px] font-bold tracking-[0.2em] uppercase text-(--feedback-correct)">
					How to play
				</p>

				<h1 class="text-3xl sm:text-[38px] font-bold mt-5 tracking-tight">
					Five letters. Six chances.
				</h1>

				<p class="text-(--text-secondary) mt-3 text-sm sm:text-base">
					Guess the hidden word. Let the colors guide your next move.
				</p>
			</section>

			<div class="mt-10 rounded-md bg-(--how-to-play) px-6 py-5">
				<p class="text-sm sm:text-base text-(--text-secondary)">
					Each guess must be a valid five-letter word. Press Enter to submit.
				</p>
			</div>

			<section class="mt-9">
				<h2 class="text-[11px] font-bold uppercase tracking-[0.18em] text-(--text-secondary) mb-4">
					Read the colors
				</h2>

				<div>
					{#each examples as example, index}
						<div
							class={`grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-5 sm:gap-8 py-7 ${index !== examples.length - 1 ? 'border-(--border)' : ''}`}
							class:border-b={index !== examples.length - 1}
						>
							<div class="flex gap-1.5 sm:gap-2">
								{#each example.word.split('') as letter, letterIndex}
									<div
										class={`flex-1 aspect-square max-w-[50px] flex items-center justify-center border rounded-[4px] text-xl sm:text-2xl font-bold ${letterIndex === example.highlightedIndex ? statusClasses[example.status] : 'border-(--border) bg-transparent text-(--text)'}`}
									>
										{letter}
									</div>
								{/each}
							</div>

							<div>
								<h3 class="font-semibold text-base">{example.title}</h3>
								<p class="text-(--text-secondary) text-sm leading-relaxed mt-2">
									{example.description}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<p class="text-center text-(--text-secondary) text-sm mt-8 leading-relaxed">
				One new puzzle, every day. Come back and keep your streak going.
			</p>

			<a
				href="/"
				class="mt-11 w-full flex min-h-14 items-center justify-center rounded-md bg-(--action-primary) text-(--background) font-semibold text-sm hover:opacity-90 transition-opacity"
				>Let's play</a
			>
		</main>
	</div>
</div>
