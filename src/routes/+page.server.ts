import type { PageServerLoad } from './$types'

type WordleResponse {
	id: number;
	solution: string;
	print_date: string;
	editor: string;
	days_since_launch: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('https://www.nytimes.com/svc/wordle/v2/2026-11-16.json')

	if (!response.ok) {
		throw new Error('Failed to fetch word of the day')
	}

	const wordle = await response.json() as WordleResponse
	return { solution: wordle.solution }
}
