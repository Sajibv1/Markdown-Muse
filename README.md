# Markdown Muse ✨

A beautiful, visual markdown editor built with React, TanStack Start, and Tailwind CSS. Write markdown with a rich formatting toolbar, see live preview, and export anywhere.

![Markdown Muse](https://img.shields.io/badge/Markdown-Muse-7c3aed?style=for-the-badge&logo=markdown&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## Features

- **📝 Visual Formatting Toolbar** — Bold, italic, headings, lists, code blocks, links, images, tables, and more — all one click away
- **⌨️ Keyboard Shortcuts** — `Ctrl+B` (bold), `Ctrl+I` (italic), `Ctrl+K` (link), `Ctrl+E` (code), and more
- **👀 Live Preview** — Real-time rendered markdown with GitHub-flavored markdown support
- **🎨 Dark & Light Themes** — Toggle between themes with one click; preference is persisted
- **📊 Line Numbers** — Code editor-style line numbers with active line highlighting
- **↔️ Resizable Split Panes** — Drag to resize editor and preview panels
- **📐 Layout Modes** — Switch between split view, editor-only, or preview-only
- **📋 Cheat Sheet** — Built-in markdown syntax reference panel
- **💾 Auto-save** — Content is automatically saved to your browser's localStorage
- **📤 Export** — Download as standalone HTML or save as PDF
- **📁 File Import** — Drag & drop `.md` files or fetch from a URL
- **🎯 GFM Support** — Tables, task lists, strikethrough, and autolinks

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + custom design tokens |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm + rehype-highlight |
| Build | [Vite 8](https://vite.dev) + [Nitro](https://nitro.build) |
| Deployment | [Vercel](https://vercel.com) (serverless functions) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- npm (comes with Node.js)

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Bold | `Ctrl+B` |
| Italic | `Ctrl+I` |
| Link | `Ctrl+K` |
| Inline Code | `Ctrl+E` |
| Strikethrough | `Ctrl+Shift+X` |
| Code Block | `Ctrl+Shift+K` |
| Indent | `Tab` |
| Outdent | `Shift+Tab` |

## Deployment

This project is configured for **Vercel** deployment out of the box.

### Deploy to Vercel

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Vercel will auto-detect the build settings
4. Click **Deploy**

No additional configuration is needed — `vercel.json` and the Nitro preset are already set up.

### Environment Variables

If your app uses any `VITE_*` environment variables, add them in **Vercel Dashboard → Settings → Environment Variables**.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── markdown/        # Editor, preview, toolbar, cheat sheet
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # Custom React hooks
│   │   ├── use-editor-actions.ts    # Markdown formatting actions
│   │   ├── use-keyboard-shortcuts.ts
│   │   ├── use-local-storage.ts
│   │   └── use-theme.ts
│   ├── lib/                 # Utilities (export, error handling)
│   ├── routes/              # TanStack file-based routes
│   │   ├── __root.tsx       # App shell (HTML, head, providers)
│   │   └── index.tsx        # Main editor page
│   ├── server.ts            # SSR error wrapper
│   ├── start.ts             # TanStack Start entry
│   └── styles.css           # Design system + markdown typography
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite + Nitro (Vercel preset)
└── vercel.json
```

## License

MIT
