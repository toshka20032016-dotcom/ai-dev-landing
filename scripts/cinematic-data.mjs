/** Per-project cinematic autoplay config (subtitles, waypoints, liveUrl). */

/** @typedef {{ at: number, text: string }} CinematicSubtitle */
/** @typedef {{ at: number, selector?: string, scrollY?: number, phoneScroll?: boolean, duration?: number, pauseMs?: number, click?: string }} CinematicWaypoint */

/** @type {Record<string, { subtitles: CinematicSubtitle[], waypoints: CinematicWaypoint[], liveUrl?: string | null }>} */
export const CINEMATIC_BY_SLUG = {
  blackcraftlab: {
    liveUrl: "https://blackcraftlab.vercel.app",
    subtitles: [
      { at: 0, text: "BLACKCRAFTLAB — AI-native лендинг агентства с неоновой типографикой и production-ready архитектурой." },
      { at: 0.28, text: "Hero с Flexbox-сеткой, wiki-порталом и интерактивным калькулятором стоимости под ключ." },
      { at: 0.52, text: "Сравнение макета и live-сайта: pixel-perfect перенос из Figma в Next.js и Vercel Edge." },
      { at: 0.78, text: "PageSpeed, Framer Motion и Cursor Agent — готовность к масштабированию продукта." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.25, selector: "#design-system", duration: 2600, pauseMs: 1400 },
      { at: 0.42, selector: "#process", duration: 2200, pauseMs: 1200 },
      { at: 0.58, selector: "#comparison", duration: 2800, pauseMs: 1600, click: ".compare-range" },
      { at: 0.72, selector: "#gallery", duration: 2400, pauseMs: 1500, phoneScroll: true },
      { at: 0.88, selector: "#under-the-hood", duration: 2200, pauseMs: 1400, click: ".code-tab" },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 2000 },
    ],
  },
  "villa-poseidon": {
    liveUrl: "https://poseidon-villa.vercel.app",
    subtitles: [
      { at: 0, text: "Villa Poseidon — премиальный scrollytelling для виллы в Геленджике с параллаксом и lifestyle-фото." },
      { at: 0.32, text: "Story-панели раскрывают локацию, инфраструктуру и атмосферу отдыха у моря." },
      { at: 0.62, text: "Мобильная версия с плавным скроллом длинного макета — first mobile UX." },
      { at: 0.88, text: "Статический HTML/CSS готов к интеграции в CMS или Vercel без потери качества." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2600, pauseMs: 2000 },
      { at: 0.3, selector: "#design-system", duration: 2400, pauseMs: 1400 },
      { at: 0.5, selector: "#parallax", duration: 2800, pauseMs: 1600 },
      { at: 0.68, selector: "#gallery", duration: 2600, pauseMs: 1500, phoneScroll: true },
      { at: 0.85, selector: "#metrics", duration: 2200, pauseMs: 1400 },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1800 },
    ],
  },
  "ghost-garage": {
    liveUrl: "https://ghost-garage-demo.vercel.app",
    subtitles: [
      { at: 0, text: "GhostGarage CRM — B2B SaaS для автосервисов: заказы, клиенты и 3D-конфигуратор в одном интерфейсе." },
      { at: 0.3, text: "Three.js-сцена и sticky-шапка создают ощущение premium garage без тяжёлого WebGL на mobile." },
      { at: 0.58, text: "Post-scheduler UI и CRM-grid — production demo на Vercel для инвесторов и партнёров." },
      { at: 0.85, text: "PostgreSQL, server actions и визуальный QA на 375px и 1280px." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.28, selector: "#process", duration: 2400, pauseMs: 1300 },
      { at: 0.48, selector: "#comparison", duration: 2600, pauseMs: 1500 },
      { at: 0.65, selector: "#gallery", duration: 2400, pauseMs: 1400, phoneScroll: true },
      { at: 0.82, selector: "#under-the-hood", duration: 2200, pauseMs: 1200 },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1600 },
    ],
  },
  bulochnaya: {
    liveUrl: "https://bulochnaya-marii-kovrizhkinoy.vercel.app",
    subtitles: [
      { at: 0, text: "Булочная Марии Коврижкиной — бутиковый food-лендинг с тёплой палитрой и каталогом продукции." },
      { at: 0.35, text: "Storytelling секции и product-grid передают craft-эстетику локальной пекарни." },
      { at: 0.65, text: "Mobile-first вёрстка: быстрая загрузка и CTA «заказать» в один тап." },
      { at: 0.9, text: "Готово к подключению CMS и production URL на Vercel." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.3, selector: "#design-system", duration: 2200, pauseMs: 1300 },
      { at: 0.52, selector: "#gallery", duration: 2600, pauseMs: 1500, phoneScroll: true },
      { at: 0.72, selector: "#problem-solution", duration: 2200, pauseMs: 1200 },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1800 },
    ],
  },
  "yandex-pet-day": {
    liveUrl: "https://yandex-pet-day-opal.vercel.app",
    subtitles: [
      { at: 0, text: "Yandex Pet Day — event-лендинг с Lenis scroll, Framer Motion и speaker-grid конференции." },
      { at: 0.33, text: "Timeline и immersive-блоки ведут гостя от hero к программе и регистрации." },
      { at: 0.66, text: "Visual QA на desktop и mobile: fluid typography и production URL." },
      { at: 0.9, text: "Next.js 15 + Tailwind v4 — deploy-ready за один спринт." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2600, pauseMs: 1900 },
      { at: 0.32, selector: "#parallax", duration: 2600, pauseMs: 1400 },
      { at: 0.55, selector: "#gallery", duration: 2400, pauseMs: 1500, phoneScroll: true },
      { at: 0.78, selector: "#metrics", duration: 2200, pauseMs: 1300 },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1700 },
    ],
  },
  "ghost-arbitrage": {
    liveUrl: "https://ghost-arbitrage.vercel.app",
    subtitles: [
      { at: 0, text: "Ghost Arbitrage — CS2 арбитраж: real-time Steam и DMarket API с emerald-акцентами." },
      { at: 0.34, text: "KPI-карточки и rate-limit guard показывают зрелость trading-продукта." },
      { at: 0.64, text: "Портфолио-лендинг для инвесторов: backend на Python и deploy на Vercel." },
      { at: 0.88, text: "Чистая архитектура: asyncio workers, healthcheck и Docker-ready pipeline." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.3, selector: "#comparison", duration: 2600, pauseMs: 1500 },
      { at: 0.52, selector: "#gallery", duration: 2400, pauseMs: 1400, phoneScroll: true },
      { at: 0.72, selector: "#under-the-hood", duration: 2200, pauseMs: 1300, click: ".code-tab" },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1600 },
    ],
  },
  "usmanova-fit": {
    liveUrl: "https://usmanova-fit.vercel.app",
    subtitles: [
      { at: 0, text: "UsmanovaTeam Fit — фитнес-лендинг с розовым акцентом, программами и mobile CTA." },
      { at: 0.32, text: "Offer-блоки и pricing grid конвертируют трафик в заявку на марафон." },
      { at: 0.62, text: "Responsive HTML/CSS: offer → signup → благодарность без лишнего JS." },
      { at: 0.88, text: "Production на Vercel — готово к рекламным кампаниям." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.3, selector: "#design-system", duration: 2200, pauseMs: 1300 },
      { at: 0.52, selector: "#gallery", duration: 2600, pauseMs: 1500, phoneScroll: true },
      { at: 0.74, selector: "#problem-solution", duration: 2200, pauseMs: 1200, click: ".offer button" },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1800 },
    ],
  },
  "csgo-sniper-bot": {
    liveUrl: "https://github.com/Alotyn/csgo-sniper-bot",
    subtitles: [
      { at: 0, text: "CS:GO Sniper Bot — высокоскоростной арбитраж скинов: Steam, DMarket и PriceEmpire API." },
      { at: 0.32, text: "Asyncio pipeline и rate-limit защищают аккаунты от банов при высоком throughput." },
      { at: 0.62, text: "Playwright fallback и Docker deploy — чистый backend без лишнего Web UI." },
      { at: 0.88, text: "Архитектура для VPS: healthcheck, логирование и масштабирование воркеров." },
    ],
    waypoints: [
      { at: 0, selector: "#hero", duration: 2400, pauseMs: 1800 },
      { at: 0.3, selector: "#process", duration: 2400, pauseMs: 1300 },
      { at: 0.52, selector: "#under-the-hood", duration: 2600, pauseMs: 1500, click: ".code-tab" },
      { at: 0.74, selector: "#metrics", duration: 2200, pauseMs: 1400 },
      { at: 1, selector: "#elite-cta", duration: 2000, pauseMs: 1700 },
    ],
  },
};

/** @param {{ slug: string, demoUrl?: string, cinematic?: object }} p */
export function cinematicFor(p) {
  const base = CINEMATIC_BY_SLUG[p.slug];
  if (!base) return null;
  const live =
    p.demoUrl && !p.demoUrl.includes("github.com") ? p.demoUrl : base.liveUrl?.includes("github") ? null : base.liveUrl;
  return { ...base, liveUrl: live ?? null, ...(p.cinematic ?? {}) };
}
