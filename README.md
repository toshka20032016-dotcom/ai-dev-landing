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

## Higgsfield MCP (image & video generation)

[Higgsfield](https://higgsfield.ai) provides an MCP server for AI image and video generation in Cursor.

**Free tier:** ~15 credits/month (see [Higgsfield docs](https://higgsfield.ai) for current limits).

### Connect in Cursor

1. Copy `.cursor/mcp.json` from this repo, or add to your user MCP config (`~/.cursor/mcp.json` on macOS/Linux, `%USERPROFILE%\.cursor\mcp.json` on Windows):

```json
"higgsfield": {
  "url": "https://mcp.higgsfield.ai/mcp"
}
```

2. Open **Cursor Settings → MCP** and enable **higgsfield**.
3. On first use, complete **OAuth** in the browser — no API keys required.
4. **Restart Cursor** after editing `mcp.json` so the server loads.

The `/preview` landing uses canvas particles and CSS 3D (void black + violet); Higgsfield is optional for future asset generation.

## Environment variables

Visit notifications are sent to Telegram when env vars are set on Vercel:

```
TELEGRAM_TOKEN=...   # from @BotFather
TELEGRAM_CHAT_ID=... # from @userinfobot
```

Redeploy after adding or changing these variables in Vercel → Settings → Environment Variables.

## Customize

Edit `src/lib/design-tokens.ts` and `src/content/ru.ts` first, then sections.

Copy more Magic UI components from https://magicui.design/docs into `src/components/magicui/`.
