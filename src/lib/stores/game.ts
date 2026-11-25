export type LetterStatus = 'correct' | 'present' | 'absent'
export type GameStatus = 'playing' | 'won' | 'lost'

export type Guess = {
	word: string
	result: LetterStatus[]
}

export type SavedGame = {
	solution: string
	guesses: Guess[]
	currentGuess: string
	gameStatus: GameStatus
}

const KEY = 'w-game'

function loadGame(solution: string) {
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as SavedGame | null

		return saved?.solution === solution ? saved : null
	} catch {
		return null
	}
}

function saveGame(game: SavedGame) {
	try {
		localStorage.setItem(KEY, JSON.stringify(game))
	} catch {}
}

export const gameStorage = {
	loadGame,
	saveGame,
}
