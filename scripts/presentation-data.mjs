/** Portfolio project metadata for presentation generator (from gh + ru.ts). */

/**
 * @typedef {Object} Project
 * @property {string} slug
 * @property {string} title
 * @property {string} tagline
 * @property {number} year
 * @property {string} type
 * @property {string} overview
 * @property {string} problem
 * @property {string} solution
 * @property {string[]} techs
 * @property {string[]} features
 * @property {{ value: string, label: string, desc?: string }[]} metrics
 * @property {string} [demoUrl]
 * @property {string} githubUrl
 * @property {string} repo
 * @property {string} language
 * @property {string[]} [mockupDirs]
 * @property {string[]} [mockupPatterns]
 * @property {string} accent
 * @property {string} [accentSecondary]
 * @property {{ name: string, hex: string }[]} [palette]
 * @property {string} [fontDisplay]
 * @property {string} [fontBody]
 * @property {string[]} [architecture]
 * @property {{ html: string, css: string, js: string }} [codeSnippets]
 * @property {{ perf: number, a11y: number, seo: number }} [pageSpeedScores]
 * @property {string[]} [comparisonTooltips]
 * @property {{ subtitles: Array<{at:number,text:string}>, waypoints: Array<object>, liveUrl?: string|null }} [cinematic]
 * @property {{ mockup?: string, live?: string }} [comparisonImages]
 */

/** @type {Project[]} */
import { cinematicFor as _cinematicFor } from "./cinematic-data.mjs";

const _PROJECTS_RAW = [
  {
    "slug": "blackcraftlab",
    "title": "BLACKCRAFTLAB",
    "tagline": "AI-Native инжиниринг · премиум лендинг",
    "year": 2026,
    "type": "Agency / Портфолио",
    "overview": "Флагманский сайт студии AI-разработки: scrollytelling, интерактивный терминал, wiki-база знаний, калькулятор стоимости и живое портфолио с демо-ссылками. Демонстрирует полный production-стек и подход к вайбкодингу через Cursor Agent.",
    "problem": "Нужен премиальный digital-образ студии, который одновременно продаёт услуги, показывает кейсы и доказывает техническую экспертизу — без типового шаблонного лендинга.",
    "solution": "Next.js 16 + Tailwind v4 + Magic UI: тёмная неоновая эстетика, Lenis-скролл, Framer Motion, Visual QA через Playwright, деплой на Vercel Edge.",
    "techs": [
      "Next.js 16",
      "TypeScript",
      "Tailwind v4",
      "Framer Motion",
      "Lenis",
      "shadcn/ui",
      "Magic UI",
      "Playwright",
      "Vercel"
    ],
    "features": [
      "Интерактивный AI-терминал с анимированными сценариями (бот, парсер, CRM)",
      "Живое портфолио с каруселью production-демо",
      "Wiki-база знаний по Telegram-ботам, парсерам и CRM",
      "Калькулятор стоимости и страница pricing",
      "Форма обратной связи с server actions и Zod-валидацией",
      "Visual QA: автотесты на 375px и 1280px"
    ],
    "metrics": [
      {
        "value": "3-й день",
        "label": "MVP в production",
        "desc": "Рабочее ядро задеплоено на 3-й день"
      },
      {
        "value": "×3",
        "label": "Скорость разработки",
        "desc": "AI-ассистенты + Cursor Agent"
      },
      {
        "value": "0%",
        "label": "Legacy-код",
        "desc": "Чистый современный стек"
      },
      {
        "value": "100%",
        "label": "Visual QA",
        "desc": "Playwright на каждом релизе"
      }
    ],
    "demoUrl": "https://blackcraftlab.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/ai-dev-landing",
    "repo": "ai-dev-landing",
    "language": "TypeScript",
    "mockupDirs": [
      "blackcraftlab-mockups",
      "portfolio-mockups"
    ],
    "mockupPatterns": [
      "mockup-homepage-desktop.png",
      "mockup-pricing-desktop.png",
      "homepage-desktop.png",
      "pricing-desktop.png"
    ],
    "accent": "#22d3ee",
    "accentSecondary": "#a78bfa",
    "palette": [
      {
        "name": "Void",
        "hex": "#050508"
      },
      {
        "name": "Surface",
        "hex": "#0c0c14"
      },
      {
        "name": "Cyan",
        "hex": "#22d3ee"
      },
      {
        "name": "Violet",
        "hex": "#a78bfa"
      },
      {
        "name": "Snow",
        "hex": "#f1f5f9"
      },
      {
        "name": "Slate",
        "hex": "#94a3b8"
      }
    ],
    "architecture": [
      "Brief & wireframe",
      "Next.js + Magic UI",
      "Visual QA Playwright",
      "Vercel Edge deploy"
    ],
    "pageSpeedScores": {
      "perf": 96,
      "a11y": 92,
      "seo": 100
    },
    "comparisonTooltips": [
      "Адаптивная Flexbox-сетка hero",
      "CSS Grid 12 колонок",
      "Neon glow через color-mix"
    ],
    "codeSnippets": {
      "html": "<section class=\"hero\" id=\"top\">\n  <h1>AI-Native инжиниринг</h1>\n  <p>Премиум лендинг · production-ready</p>\n  <a href=\"#contact\">Обсудить проект</a>\n</section>",
      "css": ":root {\n  --accent: #22d3ee;\n  --accent2: #a78bfa;\n  --bg: #050508;\n}\n.hero {\n  display: grid;\n  gap: clamp(32px, 4vw, 64px);\n}",
      "js": "import Lenis from \"lenis\";\n\nconst lenis = new Lenis({ smoothWheel: true });\nfunction raf(t) {\n  lenis.raf(t);\n  requestAnimationFrame(raf);\n}\nrequestAnimationFrame(raf);"
    }
  },
  {
    "slug": "ghost-garage",
    "title": "GhostGarage CRM",
    "tagline": "CRM для автосервисов и детейлинга",
    "year": 2026,
    "type": "CRM / B2B SaaS",
    "overview": "Полноценная экосистема для автоматизации процессов в автосервисах и детейлинг-студиях. Включает 3D-конфигуратор выхлопных систем, интерактивный планировщик постов и продвинутый учёт клиентов.",
    "problem": "Автосервисы теряют заявки в мессенджерах, не видят загрузку постов и не могут визуально продавать кастомные выхлопные системы клиентам онлайн.",
    "solution": "Единая CRM с 3D-визуализацией, планировщиком смен и клиентской базой — развёрнута и протестирована под ключ.",
    "techs": [
      "Next.js",
      "Tailwind v4",
      "Framer Motion",
      "Three.js",
      "PostgreSQL",
      "TypeScript"
    ],
    "features": [
      "3D-конфигуратор выхлопных систем (Three.js)",
      "Интерактивный планировщик постов для мастеров",
      "Учёт клиентов и история заказов",
      "Портфолио-лендинг для привлечения B2B-клиентов",
      "Адаптивный интерфейс desktop + mobile"
    ],
    "metrics": [
      {
        "value": "3D",
        "label": "Конфигуратор",
        "desc": "Визуализация выхлопных систем"
      },
      {
        "value": "CRM",
        "label": "Полный цикл",
        "desc": "От заявки до закрытия заказа"
      },
      {
        "value": "Live",
        "label": "Production demo",
        "desc": "Рабочее демо на Vercel"
      }
    ],
    "demoUrl": "https://ghost-garage-demo.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/GhostGarage",
    "repo": "GhostGarage",
    "language": "TypeScript",
    "mockupDirs": [
      "portfolio-mockups",
      "ghost-garage-mockups"
    ],
    "accent": "#f97316",
    "accentSecondary": "#fb923c",
    "palette": [
      {
        "name": "Void",
        "hex": "#0a0806"
      },
      {
        "name": "Garage",
        "hex": "#1a1410"
      },
      {
        "name": "Orange",
        "hex": "#f97316"
      },
      {
        "name": "Amber",
        "hex": "#fb923c"
      },
      {
        "name": "Steel",
        "hex": "#e2e8f0"
      },
      {
        "name": "Smoke",
        "hex": "#94a3b8"
      }
    ],
    "architecture": [
      "CRM schema",
      "Three.js configurator",
      "Post scheduler UI",
      "Vercel demo deploy"
    ],
    "pageSpeedScores": {
      "perf": 94,
      "a11y": 90,
      "seo": 98
    },
    "comparisonTooltips": [
      "3D canvas слой Three.js",
      "CRM grid 8 колонок",
      "Sticky scheduler header"
    ],
    "codeSnippets": {
      "html": "<main class=\"crm-dashboard\">\n  <aside class=\"sidebar\">Посты</aside>\n  <section id=\"planner\">Планировщик</section>\n</main>",
      "css": ".crm-dashboard {\n  display: grid;\n  grid-template-columns: 280px 1fr;\n  min-height: 100dvh;\n}",
      "js": "import * as THREE from \"three\";\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(45, 16/9, 0.1, 100);"
    }
  },
  {
    "slug": "ghost-arbitrage",
    "title": "Ghost Arbitrage",
    "tagline": "CS2 арбитраж · портфолио-лендинг",
    "year": 2026,
    "type": "FinTech / Trading Bot",
    "overview": "Платформа арбитража скинов CS2 между Steam и DMarket с портфолио-лендингом на Vercel. Backend на Python обрабатывает API-потоки в реальном времени.",
    "problem": "Ручной мониторинг цен на скины между площадками отнимает часы; выгодные сделки исчезают за секунды.",
    "solution": "Автоматизированный арбитражный движок с защитой от банов + презентационный лендинг для демонстрации продукта инвесторам и партнёрам.",
    "techs": [
      "Python",
      "Asyncio",
      "Playwright",
      "Docker",
      "Vercel",
      "Next.js"
    ],
    "features": [
      "Мониторинг цен в реальном времени",
      "Кросс-площадочный поиск арбитражных сделок",
      "Защита от rate-limit и банов API",
      "Docker-контейнеризация backend",
      "Портфолио-лендинг на Vercel"
    ],
    "metrics": [
      {
        "value": "RT",
        "label": "Real-time",
        "desc": "Потоки данных API в реальном времени"
      },
      {
        "value": "CS2",
        "label": "Рынок",
        "desc": "Steam + DMarket"
      },
      {
        "value": "Docker",
        "label": "Deploy",
        "desc": "Изолированный runtime"
      }
    ],
    "demoUrl": "https://ghost-arbitrage.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/GhostArbitrage",
    "repo": "GhostArbitrage",
    "language": "Python",
    "mockupDirs": [
      "portfolio-mockups",
      "ghost-arbitrage-mockups"
    ],
    "accent": "#10b981",
    "accentSecondary": "#34d399",
    "palette": [
      {
        "name": "Void",
        "hex": "#040a08"
      },
      {
        "name": "Panel",
        "hex": "#0c1410"
      },
      {
        "name": "Emerald",
        "hex": "#10b981"
      },
      {
        "name": "Mint",
        "hex": "#34d399"
      },
      {
        "name": "Ghost",
        "hex": "#ecfdf5"
      },
      {
        "name": "Muted",
        "hex": "#6b7280"
      }
    ],
    "architecture": [
      "Price stream API",
      "Arbitrage engine",
      "Rate-limit guard",
      "Portfolio landing"
    ],
    "pageSpeedScores": {
      "perf": 97,
      "a11y": 88,
      "seo": 96
    },
    "comparisonTooltips": [
      "Real-time price ticker",
      "Glass KPI cards",
      "Emerald accent tokens"
    ],
    "codeSnippets": {
      "html": "<section class=\"metrics\">\n  <article class=\"kpi\" data-stream=\"steam\">\n    <h3>Steam</h3>\n  </article>\n</section>",
      "css": ".kpi {\n  backdrop-filter: blur(12px);\n  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);\n}",
      "js": "async function pollPrices() {\n  const res = await fetch(\"/api/arbitrage\");\n  return res.json();\n}"
    }
  },
  {
    "slug": "yandex-pet-day",
    "title": "Yandex Pet Day",
    "tagline": "Лендинг технической конференции",
    "year": 2026,
    "type": "Event Landing",
    "overview": "Высокотехнологичный одностраничный сайт для технической конференции Yandex Pet Day. Интерактивная программа, кастомные таймлайны расписания, адаптивные сетки спикеров и плавная инерционная прокрутка.",
    "problem": "Конференции нужен digital-хаб: расписание, спикеры, регистрация — всё в одном immersive-опыте, а не в PDF-программе.",
    "solution": "Премиальный event-лендинг с Lenis Scroll, Framer Motion и сложными адаптивными сетками — готов к production за считанные дни.",
    "techs": [
      "Next.js 16",
      "Tailwind v4",
      "Framer Motion",
      "Lenis Scroll",
      "Playwright"
    ],
    "features": [
      "Интерактивная программа мероприятия",
      "Кастомные таймлайны расписания",
      "Адаптивные сетки спикеров",
      "Плавная инерционная прокрутка (Lenis)",
      "Visual QA на мобильных и desktop"
    ],
    "metrics": [
      {
        "value": "1",
        "label": "Страница",
        "desc": "Полный event-опыт на одном URL"
      },
      {
        "value": "MVP",
        "label": "Срок",
        "desc": "Быстрый production-цикл"
      },
      {
        "value": "Live",
        "label": "Демо",
        "desc": "yandex-pet-day-opal.vercel.app"
      }
    ],
    "demoUrl": "https://yandex-pet-day-opal.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/yandex-pet-day",
    "repo": "yandex-pet-day",
    "language": "CSS",
    "mockupDirs": [
      "portfolio-mockups",
      "yandex-pet-day-mockups"
    ],
    "accent": "#facc15",
    "accentSecondary": "#fde047",
    "palette": [
      {
        "name": "Void",
        "hex": "#0a0a06"
      },
      {
        "name": "Stage",
        "hex": "#14120a"
      },
      {
        "name": "Gold",
        "hex": "#facc15"
      },
      {
        "name": "Lemon",
        "hex": "#fde047"
      },
      {
        "name": "White",
        "hex": "#fafafa"
      },
      {
        "name": "Gray",
        "hex": "#a1a1aa"
      }
    ],
    "architecture": [
      "Event content model",
      "Speaker grid",
      "Lenis scroll",
      "Playwright QA"
    ],
    "pageSpeedScores": {
      "perf": 95,
      "a11y": 91,
      "seo": 99
    },
    "comparisonTooltips": [
      "Speaker CSS Grid",
      "Timeline Flexbox",
      "Lenis scroll root"
    ],
    "codeSnippets": {
      "html": "<section id=\"schedule\">\n  <h2>Программа Pet Day</h2>\n  <ol class=\"timeline\">\n    <li>Keynote</li>\n  </ol>\n</section>",
      "css": ".timeline {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}",
      "js": "const speakers = document.querySelectorAll(\".speaker-card\");\nspeakers.forEach((el, i) => {\n  el.style.setProperty(\"--delay\", i * 80 + \"ms\");\n});"
    }
  },
  {
    "slug": "bulochnaya",
    "title": "Булочная Марии Коврижкиной",
    "tagline": "Бутиковый лендинг пекарни",
    "year": 2026,
    "type": "Food / Local Business",
    "overview": "Премиальный лендинг для бутиковой пекарни Марии Коврижкиной. Тёплая эстетика, каталог продукции, storytelling бренда и мобильная вёрстка для локального бизнеса.",
    "problem": "Небольшому бренду нужен сайт, который передаёт атмосферу ручной выпечки и конвертирует посетителей в заказы — без дорогой CMS.",
    "solution": "Лёгкий статический лендинг с выразительной типографикой, фото-галереей и чёткими CTA — задеплоен на Vercel.",
    "techs": [
      "JavaScript",
      "HTML",
      "CSS",
      "Vercel"
    ],
    "features": [
      "Storytelling и визуальная идентичность бренда",
      "Каталог продукции и сезонных предложений",
      "Мобильная адаптация для заказов с телефона",
      "Быстрая загрузка без тяжёлых фреймворков",
      "Два production-URL (основной + alt)"
    ],
    "metrics": [
      {
        "value": "2",
        "label": "Live URL",
        "desc": "Основной + резервный домен"
      },
      {
        "value": "Fast",
        "label": "Загрузка",
        "desc": "Лёгкий статический стек"
      },
      {
        "value": "2026",
        "label": "Год",
        "desc": "Актуальный production"
      }
    ],
    "demoUrl": "https://bulochnaya-marii-kovrizhkinoy.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/bulochnaya-marii-kovrizhkinoy",
    "repo": "bulochnaya-marii-kovrizhkinoy",
    "language": "JavaScript",
    "mockupDirs": [
      "portfolio-mockups",
      "bulochnaya-mockups"
    ],
    "accent": "#fbbf24",
    "accentSecondary": "#fcd34d",
    "palette": [
      {
        "name": "Crust",
        "hex": "#1a1208"
      },
      {
        "name": "Dough",
        "hex": "#2a1f12"
      },
      {
        "name": "Honey",
        "hex": "#fbbf24"
      },
      {
        "name": "Butter",
        "hex": "#fcd34d"
      },
      {
        "name": "Cream",
        "hex": "#fef3c7"
      },
      {
        "name": "Cocoa",
        "hex": "#78716c"
      }
    ],
    "architecture": [
      "Brand story sections",
      "Product catalog",
      "Mobile-first layout",
      "Vercel static deploy"
    ],
    "pageSpeedScores": {
      "perf": 99,
      "a11y": 95,
      "seo": 100
    },
    "comparisonTooltips": [
      "Тёплая типографика",
      "Product catalog grid",
      "Mobile-first CTA"
    ],
    "codeSnippets": {
      "html": "<section class=\"catalog\">\n  <h2>Свежая выпечка</h2>\n  <div class=\"product-grid\"></div>\n</section>",
      "css": ".product-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1.25rem;\n}",
      "js": "document.querySelectorAll(\".product-card\").forEach((card) => {\n  card.addEventListener(\"click\", () => card.classList.toggle(\"is-open\"));\n});"
    }
  },
  {
    "slug": "villa-poseidon",
    "title": "Villa Poseidon",
    "tagline": "Scrollytelling · вилла в Геленджике",
    "year": 2026,
    "type": "Hospitality / Real Estate",
    "overview": "Премиальный scrollytelling-лендинг для виллы Poseidon в Геленджике. Иммерсивная подача объекта недвижимости с плавными переходами и визуальным storytelling.",
    "problem": "Премиальная недвижимость продаётся через эмоцию и атмосферу — стандартный каталог с фото не передаёт масштаб и lifestyle объекта.",
    "solution": "Scrollytelling-формат с полноэкранными секциями, кинематографичной подачей и мобильной адаптацией для целевой аудитории.",
    "techs": [
      "HTML",
      "CSS",
      "JavaScript",
      "Vercel"
    ],
    "features": [
      "Scrollytelling-навигация по секциям",
      "Полноэкранные визуальные блоки",
      "Адаптив для мобильных устройств",
      "Быстрый деплой на Vercel Edge",
      "Премиальная типографика и spacing"
    ],
    "metrics": [
      {
        "value": "Live",
        "label": "Production",
        "desc": "poseidon-villa.vercel.app"
      },
      {
        "value": "Scroll",
        "label": "Формат",
        "desc": "Иммерсивный storytelling"
      },
      {
        "value": "2026",
        "label": "Год",
        "desc": "Актуальный релиз"
      }
    ],
    "demoUrl": "https://poseidon-villa.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/villa-poseidon",
    "repo": "villa-poseidon",
    "language": "HTML",
    "mockupDirs": [
      "portfolio-mockups",
      "villa-poseidon-mockups"
    ],
    "accent": "#38bdf8",
    "accentSecondary": "#7dd3fc",
    "palette": [
      {
        "name": "Deep",
        "hex": "#040a12"
      },
      {
        "name": "Ocean",
        "hex": "#0c1a28"
      },
      {
        "name": "Sky",
        "hex": "#38bdf8"
      },
      {
        "name": "Foam",
        "hex": "#7dd3fc"
      },
      {
        "name": "Sand",
        "hex": "#f1f5f9"
      },
      {
        "name": "Reef",
        "hex": "#64748b"
      }
    ],
    "architecture": [
      "Full-bleed hero",
      "Scrollytelling sections",
      "Lifestyle imagery",
      "Edge CDN deploy"
    ],
    "pageSpeedScores": {
      "perf": 98,
      "a11y": 93,
      "seo": 97
    },
    "comparisonTooltips": [
      "Full-bleed scrollytelling",
      "Parallax hero layers",
      "Ocean gradient mesh"
    ],
    "codeSnippets": {
      "html": "<section class=\"story-panel\" data-chapter=\"1\">\n  <h2>Villa Poseidon</h2>\n  <p>Геленджик · премиум отдых</p>\n</section>",
      "css": ".story-panel {\n  min-height: 100svh;\n  display: grid;\n  place-items: center;\n}",
      "js": "const chapters = document.querySelectorAll(\"[data-chapter]\");\nconst io = new IntersectionObserver((e) => {\n  e.forEach((x) => x.target.classList.toggle(\"is-active\", x.isIntersecting));\n});"
    }
  },
  {
    "slug": "usmanova-fit",
    "title": "UsmanovaTeam Fit",
    "tagline": "Фитнес-лендинг · марафоны Кати Усмановой",
    "year": 2026,
    "type": "Fitness / Personal Brand",
    "overview": "Современный адаптивный сайт для фитнес-марафонов Кати Усмановой (UsmanovaTeam). Продающий лендинг с программой тренировок и конверсионными блоками.",
    "problem": "Фитнес-тренеру нужен самостоятельный digital-канал для продажи марафонов без зависимости от соцсетей и маркетплейсов.",
    "solution": "Responsive HTML-лендинг с чёткой структурой оффера, отзывами и CTA — задеплоен на Vercel.",
    "techs": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "features": [
      "Продающая структура лендинга",
      "Блоки программы и расписания марафонов",
      "Адаптивная вёрстка mobile-first",
      "Оптимизация под конверсию"
    ],
    "metrics": [
      {
        "value": "Live",
        "label": "Демо",
        "desc": "usmanova-fit.vercel.app"
      },
      {
        "value": "HTML",
        "label": "Стек",
        "desc": "Лёгкий статический сайт"
      },
      {
        "value": "2026",
        "label": "Год",
        "desc": "Production на Vercel"
      }
    ],
    "demoUrl": "https://usmanova-fit.vercel.app",
    "githubUrl": "https://github.com/toshka20032016-dotcom/usmanova-fit-landing",
    "repo": "usmanova-fit-landing",
    "language": "HTML",
    "mockupDirs": [
      "portfolio-mockups",
      "usmanova-fit-mockups"
    ],
    "accent": "#ec4899",
    "accentSecondary": "#f472b6",
    "palette": [
      {
        "name": "Void",
        "hex": "#10060c"
      },
      {
        "name": "Studio",
        "hex": "#1a0a14"
      },
      {
        "name": "Pink",
        "hex": "#ec4899"
      },
      {
        "name": "Rose",
        "hex": "#f472b6"
      },
      {
        "name": "Light",
        "hex": "#fdf2f8"
      },
      {
        "name": "Ash",
        "hex": "#9ca3af"
      }
    ],
    "architecture": [
      "Offer structure",
      "Program blocks",
      "Mobile CTA",
      "Vercel deploy"
    ],
    "pageSpeedScores": {
      "perf": 97,
      "a11y": 94,
      "seo": 98
    },
    "comparisonTooltips": [
      "Offer block Flexbox",
      "Program pricing grid",
      "Pink conversion CTA"
    ],
    "codeSnippets": {
      "html": "<section class=\"offer\">\n  <h1>Марафон UsmanovaTeam</h1>\n  <button type=\"button\">Записаться</button>\n</section>",
      "css": ":root { --accent: #ec4899; }\n.offer {\n  text-align: center;\n  padding: clamp(3rem, 8vw, 6rem) 1rem;\n}",
      "js": "const cta = document.querySelector(\".offer button\");\ncta?.addEventListener(\"click\", () => {\n  document.getElementById(\"signup\")?.scrollIntoView({ behavior: \"smooth\" });\n});"
    }
  },
  {
    "slug": "csgo-sniper-bot",
    "title": "CS:GO Sniper Arbitrage Bot",
    "tagline": "Высокоскоростной арбитраж скинов",
    "year": 2026,
    "type": "Backend / Automation",
    "overview": "Высокоскоростной скрипт для мониторинга и автоматического перекрёстного поиска выгодных сделок на скины между Steam и DMarket. Обрабатывает API-потоки в реальном времени с защитой от банов.",
    "problem": "Арбитражные окна на рынке скинов длятся секунды — ручной трейдинг не масштабируется и не конкурентен.",
    "solution": "Async Python-бот с Playwright, PriceEmpire API и Docker — полностью автономный pipeline без web UI.",
    "techs": [
      "Python",
      "Asyncio",
      "Playwright",
      "PriceEmpire API",
      "Docker"
    ],
    "features": [
      "Мониторинг цен Steam и DMarket в реальном времени",
      "Автоматический поиск арбитражных возможностей",
      "Защита от rate-limit и банов",
      "Docker-контейнеризация для VPS/deploy",
      "Асинхронная архитектура на asyncio"
    ],
    "metrics": [
      {
        "value": "50k+",
        "label": "Товаров/мин",
        "desc": "Потенциал throughput парсера"
      },
      {
        "value": "0",
        "label": "Web UI",
        "desc": "Pure backend — GitHub only"
      },
      {
        "value": "Docker",
        "label": "Deploy",
        "desc": "Готов к VPS"
      }
    ],
    "demoUrl": "https://github.com/Alotyn/csgo-sniper-bot",
    "githubUrl": "https://github.com/Alotyn/csgo-sniper-bot",
    "repo": "csgo-sniper-bot",
    "language": "Python",
    "mockupDirs": [
      "portfolio-mockups"
    ],
    "accent": "#ef4444",
    "accentSecondary": "#f87171",
    "palette": [
      {
        "name": "Void",
        "hex": "#0a0606"
      },
      {
        "name": "Terminal",
        "hex": "#140c0c"
      },
      {
        "name": "Red",
        "hex": "#ef4444"
      },
      {
        "name": "Coral",
        "hex": "#f87171"
      },
      {
        "name": "Code",
        "hex": "#e2e8f0"
      },
      {
        "name": "Comment",
        "hex": "#6b7280"
      }
    ],
    "architecture": [
      "PriceEmpire API",
      "Asyncio workers",
      "Playwright fallback",
      "Docker on VPS"
    ],
    "pageSpeedScores": {
      "perf": 100,
      "a11y": 85,
      "seo": 90
    },
    "comparisonTooltips": [
      "Asyncio event loop",
      "Rate-limit guard",
      "Docker healthcheck"
    ],
    "codeSnippets": {
      "html": "<pre class=\"terminal\">\n  <code>python main.py --watch steam,dmarket</code>\n</pre>",
      "css": ".terminal {\n  font-family: \"JetBrains Mono\", monospace;\n  background: #0a0606;\n  color: #ef4444;\n}",
      "js": "# Python — asyncio worker\nasync def scan_markets():\n    async with aiohttp.ClientSession() as s:\n        return await fetch_prices(s)"
    }
  }
];

/** @type {Project[]} */
export const PROJECTS = _PROJECTS_RAW.map((p) => ({ ...p, cinematic: _cinematicFor(p) }));
