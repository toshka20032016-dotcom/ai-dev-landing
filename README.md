# blackcraftlab

Премиум open-source шаблон лендинга для разработки в Cursor Agent.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS v4
- Framer Motion · Lenis
- shadcn/ui patterns · Magic UI blocks
- Lucide icons
- Playwright E2E
- Vercel deploy

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build        # production build
npm run test:e2e     # Playwright tests
```

## Structure

```
src/
  app/                 layout, page, globals.css
  components/
    sections/          Hero, Features, Process, ...
    ui/                Button, Card (shadcn-style)
    magicui/           Animated Grid Pattern, etc.
    providers/         SmoothScrollProvider (Lenis)
  content/ru.ts        all Russian copy
  lib/                 utils, design-tokens
```

## Cursor workflow

1. Attach reference screenshot
2. Ask Agent to implement section by section
3. Use Playwright or Browser MCP for visual QA
4. Deploy via Vercel MCP

## Customize

Edit `src/lib/design-tokens.ts` and `src/content/ru.ts` first, then sections.

Copy more Magic UI components from https://magicui.design/docs into `src/components/magicui/`.
