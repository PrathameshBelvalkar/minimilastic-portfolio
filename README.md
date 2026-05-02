# Minimal dev portfolio

Personal developer portfolio and blog built with React, Vite, and TypeScript.

## Stack

- React 19, React Router 7, Vite 6
- Tailwind CSS 4
- MDX blog posts with syntax highlighting
- i18next, Motion, Mermaid, Lucide icons
- Optional Vercel Analytics

## Features

- Home page with hero, about, capabilities, experience, projects, and contact sections
- Blog index and individual post pages from MDX content
- Light and dark theme
- Optional Gemini API integration (see environment variables)

## Prerequisites

- Node.js (current LTS recommended)

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set variables as needed
3. Start the dev server: `npm run dev`

The app serves on port 3000 by default (`vite.config` / `package.json` scripts).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run lint` | Typecheck (no emit)      |

## Environment

| Variable          | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `GEMINI_API_KEY`  | Google GenAI / Gemini API (if used)          |
| `APP_URL`         | Hosted app URL for links and callbacks       |
| `VITE_SITE_URL`   | Public site URL (e.g. canonical / SEO base) |

## License

Private project (`private` in `package.json`).
