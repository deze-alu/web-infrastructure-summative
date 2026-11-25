# Wordly.

_A daily word ritual._ Wordly is a Wordle-style word game built with SvelteKit. Each day there is one hidden five-letter word, and you get six guesses to find it. After each guess, the tiles change color to show how close you are.

**Website:** [View the Website](https://www.daniel.tech)
**Demo:** [View the Demo](https://youtu.be/S2Ixqf_Kzjo)
**Design:** [View the Figma file](https://www.figma.com/design/rrVtyu9S84qO08vlsud0fb/Untitled?node-id=3-2&t=w6zzOFhNTPCJB1dP-0)

## Features

- **Daily puzzle:** the word of the day is fetched on the wordle server, so every player gets the same word.
- **Physical and on-screen keyboard:** type with your keyboard (letters, `Enter`, `Backspace`) or tap the on-screen keys.
- **Color feedback:** after each guess, every tile shows whether its letter is in the right spot, in the word but in the wrong spot, or not in the word. The keyboard keys change color too.
- **Saved progress:** your guesses and the letters you've typed are saved in the browser, so refreshing the page keeps your game. A new daily word starts a fresh game.
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

## Deploying Wordly

Wordly is live at **https://danieleze.tech**. It runs on two web servers (web-01 and web-02) behind a load balancer (lb-01).

## 1. Getting the code from GitHub

On both web-01 and web-02, I installed Git, Node.js 24, pnpm and pm2, then pulled the repository from GitHub:

```bash
git clone https://github.com/deze-alu/web-infrastructure-summative.git /var/www/wordly
cd /var/www/wordly
pnpm install
```

## 2. Running SvelteKit with pm2

SvelteKit's default `adapter-auto` only works on hosting platforms like Vercel or Netlify. On each server, I switched it to `@sveltejs/adapter-node`, which builds the app into a standalone Node.js server:

```bash
pnpm add -D @sveltejs/adapter-node
```

```ts
// vite.config.ts
import adapter from '@sveltejs/adapter-node';
```

```bash
pnpm build
```

Then I started the built server with **pm2**, a process manager that keeps the app running:

```bash
HOST=127.0.0.1 PORT=3000 ORIGIN=https://www.danieleze.tech pm2 start build/index.js --name wordly
pm2 save
pm2 startup
```

- If the app crashes, pm2 restarts it immediately.
- `pm2 save` and `pm2 startup` register the app as a system service, so it comes back after a server reboot.
- The app only listens on `127.0.0.1:3000`, so it can't be reached directly from outside. Nginx is the only way in.

## 3. Architecture

```
              Browser
                │
     https://danieleze.tech
                │
                ▼
┌───────────────────────────────┐
│        lb-01 (HAProxy)        │
│      HTTPS + round robin      │
└───────────────┬───────────────┘
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│    web-01    │ │    web-02    │
│  Nginx :80   │ │  Nginx :80   │
│      ▼       │ │      ▼       │
│ pm2 → Wordly │ │ pm2 → Wordly │
│127.0.0.1:3000│ │127.0.0.1:3000│
└──────────────┘ └──────────────┘
```

| Server | IP | Role |
| ------ | -- | ---- |
| lb-01 | 35.177.182.1 | HAProxy load balancer |
| web-01 | 13.135.166.215 | Nginx + Wordly (pm2) |
| web-02 | 18.133.221.184 | Nginx + Wordly (pm2) |

- **lb-01 (HAProxy)** handles HTTPS with a Let's Encrypt certificate for `danieleze.tech` and `www.danieleze.tech`, redirects HTTP to HTTPS, and sends requests to web-01 and web-02 in turn (round robin).
- **Nginx** on each web server receives the request on port 80 and passes it to the app on `127.0.0.1:3000`. It also adds an `X-Served-By` header with the server's name:

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name _;

        add_header X-Served-By $hostname;

        location / {
                proxy_pass http://127.0.0.1:3000;
        }
}
```
