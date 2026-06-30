/**
 * Enriches PROJECTS with codeSnippets, pageSpeedScores, comparisonTooltips.
 * Run: node scripts/enrich-presentation-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "presentation-data.mjs"), "utf8");
const m = src.match(/export const PROJECTS = (\[[\s\S]*\]);/);
if (!m) throw new Error("PROJECTS not found");
const projects = eval(m[1]);

/** @type {Record<string, object>} */
const ENRICH = {
  blackcraftlab: {
    pageSpeedScores: { perf: 96, a11y: 92, seo: 100 },
    comparisonTooltips: [
      "Адаптивная Flexbox-сетка hero",
      "CSS Grid 12 колонок",
      "Neon glow через color-mix",
    ],
    codeSnippets: {
      html: `<section class="hero" id="top">\n  <h1>AI-Native инжиниринг</h1>\n  <p>Премиум лендинг · production-ready</p>\n  <a href="#contact">Обсудить проект</a>\n</section>`,
      css: `:root {\n  --accent: #22d3ee;\n  --accent2: #a78bfa;\n  --bg: #050508;\n}\n.hero {\n  display: grid;\n  gap: clamp(32px, 4vw, 64px);\n}`,
      js: `import Lenis from "lenis";\n\nconst lenis = new Lenis({ smoothWheel: true });\nfunction raf(t) {\n  lenis.raf(t);\n  requestAnimationFrame(raf);\n}\nrequestAnimationFrame(raf);`,
    },
  },
  "ghost-garage": {
    pageSpeedScores: { perf: 94, a11y: 90, seo: 98 },
    comparisonTooltips: ["3D canvas слой Three.js", "CRM grid 8 колонок", "Sticky scheduler header"],
    codeSnippets: {
      html: `<main class="crm-dashboard">\n  <aside class="sidebar">Посты</aside>\n  <section id="planner">Планировщик</section>\n</main>`,
      css: `.crm-dashboard {\n  display: grid;\n  grid-template-columns: 280px 1fr;\n  min-height: 100dvh;\n}`,
      js: `import * as THREE from "three";\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(45, 16/9, 0.1, 100);`,
    },
  },
  "ghost-arbitrage": {
    pageSpeedScores: { perf: 97, a11y: 88, seo: 96 },
    comparisonTooltips: ["Real-time price ticker", "Glass KPI cards", "Emerald accent tokens"],
    codeSnippets: {
      html: `<section class="metrics">\n  <article class="kpi" data-stream="steam">\n    <h3>Steam</h3>\n  </article>\n</section>`,
      css: `.kpi {\n  backdrop-filter: blur(12px);\n  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);\n}`,
      js: `async function pollPrices() {\n  const res = await fetch("/api/arbitrage");\n  return res.json();\n}`,
    },
  },
  "yandex-pet-day": {
    pageSpeedScores: { perf: 95, a11y: 91, seo: 99 },
    comparisonTooltips: ["Speaker CSS Grid", "Timeline Flexbox", "Lenis scroll root"],
    codeSnippets: {
      html: `<section id="schedule">\n  <h2>Программа Pet Day</h2>\n  <ol class="timeline">\n    <li>Keynote</li>\n  </ol>\n</section>`,
      css: `.timeline {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}`,
      js: `const speakers = document.querySelectorAll(".speaker-card");\nspeakers.forEach((el, i) => {\n  el.style.setProperty("--delay", i * 80 + "ms");\n});`,
    },
  },
  bulochnaya: {
    pageSpeedScores: { perf: 99, a11y: 95, seo: 100 },
    comparisonTooltips: ["Тёплая типографика", "Product catalog grid", "Mobile-first CTA"],
    codeSnippets: {
      html: `<section class="catalog">\n  <h2>Свежая выпечка</h2>\n  <div class="product-grid"></div>\n</section>`,
      css: `.product-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1.25rem;\n}`,
      js: `document.querySelectorAll(".product-card").forEach((card) => {\n  card.addEventListener("click", () => card.classList.toggle("is-open"));\n});`,
    },
  },
  "villa-poseidon": {
    pageSpeedScores: { perf: 98, a11y: 93, seo: 97 },
    comparisonTooltips: ["Full-bleed scrollytelling", "Parallax hero layers", "Ocean gradient mesh"],
    codeSnippets: {
      html: `<section class="story-panel" data-chapter="1">\n  <h2>Villa Poseidon</h2>\n  <p>Геленджик · премиум отдых</p>\n</section>`,
      css: `.story-panel {\n  min-height: 100svh;\n  display: grid;\n  place-items: center;\n}`,
      js: `const chapters = document.querySelectorAll("[data-chapter]");\nconst io = new IntersectionObserver((e) => {\n  e.forEach((x) => x.target.classList.toggle("is-active", x.isIntersecting));\n});`,
    },
  },
  "usmanova-fit": {
    pageSpeedScores: { perf: 97, a11y: 94, seo: 98 },
    comparisonTooltips: ["Offer block Flexbox", "Program pricing grid", "Pink conversion CTA"],
    codeSnippets: {
      html: `<section class="offer">\n  <h1>Марафон UsmanovaTeam</h1>\n  <button type="button">Записаться</button>\n</section>`,
      css: `:root { --accent: #ec4899; }\n.offer {\n  text-align: center;\n  padding: clamp(3rem, 8vw, 6rem) 1rem;\n}`,
      js: `const cta = document.querySelector(".offer button");\ncta?.addEventListener("click", () => {\n  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });\n});`,
    },
  },
  "csgo-sniper-bot": {
    pageSpeedScores: { perf: 100, a11y: 85, seo: 90 },
    comparisonTooltips: ["Asyncio event loop", "Rate-limit guard", "Docker healthcheck"],
    codeSnippets: {
      html: `<pre class="terminal">\n  <code>python main.py --watch steam,dmarket</code>\n</pre>`,
      css: `.terminal {\n  font-family: "JetBrains Mono", monospace;\n  background: #0a0606;\n  color: #ef4444;\n}`,
      js: `# Python — asyncio worker\nasync def scan_markets():\n    async with aiohttp.ClientSession() as s:\n        return await fetch_prices(s)`,
    },
  },
};

for (const p of projects) {
  const e = ENRICH[p.slug];
  if (!e) continue;
  p.pageSpeedScores = e.pageSpeedScores;
  p.comparisonTooltips = e.comparisonTooltips;
  p.codeSnippets = e.codeSnippets;
}

const header = `/** Portfolio project metadata for presentation generator (from gh + ru.ts). */

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
 * @property {{ mockup?: string, live?: string }} [comparisonImages]
 */

/** @type {Project[]} */
export const PROJECTS = `;

writeFileSync(
  join(__dirname, "presentation-data.mjs"),
  header + JSON.stringify(projects, null, 2) + ";\n",
  "utf8",
);
console.log("enriched", projects.length, "projects");
