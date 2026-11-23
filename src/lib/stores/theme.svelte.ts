export type Theme = 'light' | 'dark'

let currentTheme = $state<Theme>('dark')
const KEY = 'w-theme'

function setTheme(value: Theme) {
	currentTheme = value

	if (typeof document !== 'undefined') {
		document.documentElement.dataset.theme = value
		localStorage.setItem(KEY, value)
	}
}

function toggleTheme() {
	setTheme(currentTheme === 'light' ? 'dark' : 'light')
}

function initialize() {
	const savedTheme = localStorage.getItem(KEY) as Theme | null

	if (savedTheme === 'light' || savedTheme === 'dark') {
		setTheme(savedTheme)
	} else {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

		setTheme(prefersDark ? 'dark' : 'light')
	}
}

export const theme = {
	get currentTheme() {
		return currentTheme
	},
	setTheme,
	toggleTheme,
	initialize,
}
