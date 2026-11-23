# Wordly.

_A daily word ritual._ Wordly is a Wordle-style word game built with SvelteKit. Each day there is one hidden five-letter word, and you get six guesses to find it. After each guess, the tiles change color to show how close you are.

**Design:** [View the Figma file](https://www.figma.com/design/rrVtyu9S84qO08vlsud0fb/Untitled?node-id=3-2&t=w6zzOFhNTPCJB1dP-0)

## Features

- **Daily puzzle:** the word of the day is fetched on the wordle server, so every player gets the same word.
- **Physical and on-screen keyboard:** type with your keyboard (letters, `Enter`, `Backspace`) or tap the on-screen keys.
- **Color feedback:** after each guess, every tile shows whether its letter is in the right spot, in the word but in the wrong spot, or not in the word. The keyboard keys change color too.
- **Light and dark themes:** the app follows your system preference the first time, then remembers your choice.
- **How to play page:** a short guide with examples at `/guide`.

## Tech stack

| Area            | Tool                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | [SvelteKit 3](https://svelte.dev/docs/kit) + Svelte 5 (runes)          |
| Language        | TypeScript (strict)                                                    |
| Styling         | Tailwind CSS v4 + CSS custom properties for theming                    |
| Build           | Vite 8                                                                 |
| UI extras       | `svelte-french-toast` (toasts), `@theme-toggles/svelte` (theme switch) |
| Package manager | pnpm                                                                   |

## Getting started

### Prerequisites

- **Node.js 22.17 or newer** (required by SvelteKit 3)
- **pnpm**

### Install and run

```sh
pnpm install
pnpm dev            # start the dev server at http://localhost:5173
pnpm dev --open     # same, and open it in your browser
```

### Available scripts

| Command            | What it does                               |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start the development server               |
| `pnpm build`       | Create a production build                  |
| `pnpm preview`     | Preview the production build locally       |
| `pnpm check`       | Type-check the project with `svelte-check` |
| `pnpm check:watch` | Type-check in watch mode                   |

## Project structure

```
src/
├── app.html                     # HTML shell that SvelteKit injects the app into
├── components/
│   ├── game/
│   │   └── gameBoard.svelte     # The game: grid, scoring, keyboard, win/lose state
│   ├── navigation/
│   │   └── navigation.svelte    # Top bar with logo, links and theme toggle
│   └── theme/
│       └── theme-toggle.svelte  # Light/dark switch button
├── lib/
│   ├── assets/
│   │   ├── app.css              # Global styles and light/dark color tokens
│   │   └── reset.css            # CSS reset (based on Josh Comeau's)
│   └── stores/
│       └── theme.svelte.ts      # Theme state (rune-based store)
└── routes/
    ├── +layout.svelte           # Shared layout: fonts, global CSS, theme init, toasts
    ├── +page.server.ts          # Fetches the word of the day (runs on the server)
    ├── +page.svelte             # Home page: hero text + game board
    └── guide/
        └── +page.svelte         # "How to play" page
static/                          # Files served as-is (robots.txt)
```

## How it works

### 1. Getting the word of the day

`src/routes/+page.server.ts` runs on the server before the home page renders. It builds today's date (`YYYY-MM-DD`, UTC) and calls:

```
https://www.nytimes.com/svc/wordle/v2/<date>.json
```

Only the `solution` field is sent to the page. If the request fails, the load function throws an error.

### 2. Playing the game

`src/components/game/gameBoard.svelte` holds all the game logic, using Svelte 5 runes (`$state`, `$derived`, `$props`):

- **State:** the list of submitted `guesses`, the `currentGuess` being typed, and the `gameStatus` (`playing`, `won` or `lost`).
- **Input:** a `<svelte:window onkeydown>` listener handles the physical keyboard. The on-screen keys call the same functions (`addLetter`, `deleteLetter`, `submitGuess`).
- **Scoring (`evaluateGuess`):** this runs in two passes so that repeated letters are scored correctly:
  1. Mark every letter in the exact right position as `correct`, and count the solution letters that are still unmatched.
  2. For the remaining letters, mark one as `present` only while unmatched copies of it are left. Otherwise it stays `absent`.
- **Keyboard colors (`updateKeyboard`):** each key keeps its best result so far (`correct` > `present` > `absent`), so a green key never goes back to yellow.
- **End of game:** a correct guess sets the game to `won` and shows a toast. After six wrong guesses, the game is `lost` and the answer is revealed.

### 3. Theming

- All colors are CSS variables in `src/lib/assets/app.css`. The light values are on `:root` and the dark values are on `:root[data-theme='dark']`.
- `src/lib/stores/theme.svelte.ts` is a small store that sets `data-theme` on `<html>` and saves the choice in `localStorage` (key: `w-theme`).
- On first load (`+layout.svelte` → `theme.initialize()`), it uses the saved theme if there is one. Otherwise it uses the system `prefers-color-scheme` setting.
- Components use these variables through Tailwind's arbitrary-value syntax, for example `bg-(--feedback-correct)`.

### 4. Import aliases

| Alias           | Points to          | Defined in                           |
| --------------- | ------------------ | ------------------------------------ |
| `#lib/*`        | `src/lib/*`        | `package.json` → `imports`           |
| `#components/*` | `src/components/*` | `vite.config.ts` and `tsconfig.json` |

## Known limitations / next steps

- Guesses are not checked against a dictionary. Any five letters are accepted.
- The **Statistics** link in the navigation is a placeholder.
- The puzzle number on the home page (`No. 328`) is hard-coded.
- Game progress is not saved, so refreshing the page resets the board.
- `src/components/game/game.util.ts` is empty. It is a natural place to move the scoring logic so it can be unit tested.
