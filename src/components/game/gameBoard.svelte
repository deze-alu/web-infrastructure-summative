<script lang="ts">
	import toast from 'svelte-french-toast'

	type LetterStatus = 'correct' | 'present' | 'absent'
	type GameStatus = 'playing' | 'won' | 'lost'

	type Guess = {
		word: string
		result: LetterStatus[]
	}

	let { wordOfTheDay } = $props()
	const solution = $derived((wordOfTheDay ?? '').trim().toUpperCase())

	let guesses = $state<Guess[]>([])
	let currentGuess = $state('')
	let gameStatus = $state<GameStatus>('playing')
	let message = $state('')

	let keyboardStatus = $state<Record<string, LetterStatus>>({})
	const columns = [0, 1, 2, 3, 4]

	const keyboardRows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
	]

	function evaluateGuess(guess: string) {
		const result: LetterStatus[] = Array(5).fill('absent')

		const remaining: Record<string, number> = {}

		for (let i = 0; i < 5; i++) {
			if (guess[i] === solution[i]) {
				result[i] = 'correct'
			} else {
				const letter = solution[i]
				remaining[letter] = (remaining[letter] ?? 0) + 1
			}
		}

		for (let i = 0; i < 5; i++) {
			if (result[i] === 'correct') continue

			const letter = guess[i]

			if (remaining[letter] > 0) {
				result[i] = 'present'
				remaining[letter]--
			}
		}

		return result
	}

	function updateKeyboard(guess: string, result: LetterStatus[]) {
		const priority = {
			absent: 0,
			present: 1,
			correct: 2,
		}

		const updated = { ...keyboardStatus }

		guess.split('').forEach((letter, index) => {
			const nextStatus = result[index]
			const previousStatus = updated[letter]

			if (!previousStatus || priority[nextStatus] > priority[previousStatus]) {
				updated[letter] = nextStatus
			}
		})

		keyboardStatus = updated
	}

	function addLetter(letter: string) {
		if (gameStatus !== 'playing') return
		if (currentGuess.length >= 5) return

		currentGuess += letter.toUpperCase()
		message = ''
	}

	function deleteLetter() {
		if (gameStatus !== 'playing') return

		currentGuess = currentGuess.slice(0, -1)
		message = ''
	}

	function submitGuess() {
		if (gameStatus !== 'playing') return

		if (solution.length !== 5) {
			toast.error('The daily word is not available')
			return
		}

		if (currentGuess.length !== 5) {
			toast.error('Your guess must contain 5 letters')
			return
		}

		const result = evaluateGuess(currentGuess)

		const submittedGuess: Guess = {
			word: currentGuess,
			result,
		}

		guesses = [...guesses, submittedGuess]

		updateKeyboard(currentGuess, result)

		if (currentGuess === solution) {
			gameStatus = 'won'
			toast.success('Excellent! You found the word!')
		} else if (guesses.length === 6) {
			gameStatus = 'lost'
			message = `The word was ${solution}`
		}

		currentGuess = ''
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (gameStatus !== 'playing') return
		if (event.key === 'Enter') {
			submitGuess()
			return
		}

		if (event.key === 'Backspace') {
			deleteLetter()
			return
		}

		if (/^[a-zA-Z]$/.test(event.key)) {
			addLetter(event.key)
		}
	}

	function tileClass(status: LetterStatus | 'empty', filled: boolean, active: boolean = false) {
		if (status === 'correct') {
			return 'bg-(--feedback-correct) border-(--feedback-correct) text-white'
		}

		if (status === 'present') {
			return 'bg-(--feedback-present) border-(--feedback-present) text-white'
		}

		if (status === 'absent') {
			return 'bg-(--feedback-absent) border-(--feedback-absent) text-white'
		}

		if (active) {
			return 'bg-(--tile-active) border-(--border-active) text-(--text)'
		}

		if (filled) {
			return 'bg-(--tile-typed) border-(--border-typed) text-(--text)'
		}

		return 'bg-transparent border-(--border)'
	}

	function keyClass(key: string) {
		if (key === 'ENTER') {
			return 'bg-(--action-primary) text-(--background) flex-1'
		}

		if (key === 'DELETE') {
			return 'bg-(--keyboard-unused) text-(--text) flex-[1.5]'
		}

		const status = keyboardStatus[key]

		if (status === 'correct') {
			return 'bg-(--feedback-correct) text-white'
		}

		if (status === 'present') {
			return 'bg-(--feedback-present) text-white'
		}

		if (status === 'absent') {
			return 'bg-(--keyboard-absent) text-(--text-secondary)'
		}

		return 'bg-(--keyboard-unused) text-(--text)'
	}

	function handleKeyboardClick(key: string) {
		if (key === 'ENTER') return submitGuess()
		if (key === 'DELETE') return deleteLetter()
		addLetter(key)
	}
</script>

<svelte:window onkeydown={handleKeyDown} />
<!-- Game Board -->
<div class="flex flex-col items-center w-full mt-6">
	<div class="grid grid-rows-6 gap-2">
		{#each Array.from({ length: 6 }) as _, rowIndex}
			{@const guess = guesses[rowIndex]}

			<div class="grid grid-cols-5 gap-2">
				{#each columns as colIndex}
					{@const letter =
						guess?.word[colIndex] ??
						(rowIndex === guesses.length ? (currentGuess[colIndex] ?? '') : '')}
					{@const status = guess?.result[colIndex] ?? 'empty'}
					{@const isCurrentRow = rowIndex === guesses.length}
					{@const isFilled = !!letter}
					{@const isActive =
						isCurrentRow && colIndex === currentGuess.length && currentGuess.length < 5}
					<div
						class={`flex items-center justify-center w-14 h-14 sm:w-[70px] sm:h-[70px] border-2 rounded-md text-2xl sm:text-3xl font-bold uppercase transition-colors duration-150 ${tileClass(status, isFilled, isActive)}`}
					>
						{letter}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Guess counter -->
	<p class="mt-6 text-xs font-semibold tracking-widest uppercase text-(--text-secondary)">
		Guess {Math.min(guesses.length + 1, 6)} of 6
	</p>

	<!-- Feedback -->
	{#if message}
		<p aria-live="polite" class="mt-4 text-sm font-medium text-(--text-secondary)">
			{message}
		</p>
	{/if}

	<!-- Keyboard -->
	<div class="w-full max-w-[610px] mt-12 px-2 flex flex-col gap-2">
		{#each keyboardRows as row}
			<div class="flex justify-center gap-1.5 sm:gap-2">
				{#each row as key}
					<button
						type="button"
						disabled={gameStatus !== 'playing'}
						onclick={() => handleKeyboardClick(key)}
						class={`h-[54px] sm:h-[62px] min-w-0 rounded-md font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed ${keyClass(key)} ${key.length === 1 ? 'flex-1' : ''}`}
					>
						{key === 'DELETE' ? 'Delete' : key === 'ENTER' ? 'Enter' : key}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>
