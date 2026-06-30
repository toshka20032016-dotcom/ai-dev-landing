import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOCKUPS_ROOT = "C:\\Users\\Alotyn\\Desktop\\мокапы";
const OUT_ROOT = join(MOCKUPS_ROOT, "презентации");
const ASSETS = join(OUT_ROOT, "_assets");
const { PROJECTS } = await import("./presentation-data.mjs");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** @param {string} name */
function mockupRank(name) {
  const num = name.match(/^(\d+)-/);
  if (num) return parseInt(num[1], 10);
  if (name.includes("hero")) return 1;
  if (name.includes("desktop-full")) return 50;
  if (name.includes("mobile-full")) return 51;
  if (name.includes("composite")) return 60;
  return 99;
}

/** @param {string} slug @param {string[] | undefined} dirs */
async function findMockups(slug, dirs) {
  const found = [];
  const seen = new Set();
  const addDir = async (abs) => {
    try {
      for (const f of await readdir(abs)) {
        if (!/\.(png|jpg|webp)$/i.test(f) || seen.has(f)) continue;
        seen.add(f);
        found.push({
          name: f,
          rank: mockupRank(f),
          src: relative(join(OUT_ROOT, slug), join(abs, f)).replace(/\\/g, "/"),
        });
      }
    } catch {
      /* missing dir */
    }
  };
  await addDir(join(MOCKUPS_ROOT, "portfolio-mockups", slug));
  for (const dir of dirs ?? []) await addDir(join(MOCKUPS_ROOT, dir));
  return found.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}

/** @param {{ name: string, src: string }[]} mockups */
function categorizeMockups(mockups) {
  const hero = mockups.find((m) => /^01-/.test(m.name) || /hero/.test(m.name)) ?? mockups[0];
  const sections = mockups.filter(
    (m) => /^0[2-4]-section/.test(m.name) || (/^0[2-4]-/.test(m.name) && m !== hero),
  );
  const interactive = mockups.filter((m) =>
    /pricing|quiz|calculator|terminal|configurator|block-3/i.test(m.name),
  );
  const desktop =
    mockups.find((m) => /desktop-full|desktop-mockup/.test(m.name)) ??
    mockups.find((m) => /desktop/.test(m.name) && !/pricing/.test(m.name));
  const mobile =
    mockups.find((m) => /mobile-full|mobile-mockup/.test(m.name)) ??
    mockups.find((m) => /mobile/.test(m.name) && !/pricing/.test(m.name));
  const used = new Set([hero, ...sections, ...interactive, desktop, mobile].filter(Boolean));
  const extras = mockups.filter((m) => !used.has(m)).slice(0, 4);
  const gallery = [...sections, ...interactive, ...extras].filter(Boolean).slice(0, 8);
  return { hero, sections, interactive, desktop, mobile, gallery };
}

/** @param {import('./presentation-data.mjs').Project} p */
function defaultPalette(p) {
  return (
    p.palette ?? [
      { name: "Background", hex: "#050508" },
      { name: "Surface", hex: "#0c0c14" },
      { name: "Primary", hex: p.accent },
      { name: "Secondary", hex: p.accentSecondary ?? p.accent },
      { name: "Text", hex: "#f1f5f9" },
      { name: "Muted", hex: "#94a3b8" },
    ]
  );
}

/** @param {import('./presentation-data.mjs').Project} p */
function cssVars(p) {
  const a = p.accent ?? "#22d3ee";
  const b = p.accentSecondary ?? "#a78bfa";
  return `:root{--bg:#050508;--surface:#0c0c14;--text:#f1f5f9;--muted:#94a3b8;--accent:${a};--accent2:${b};--border:rgba(148,163,184,.14);--glass:rgba(12,12,20,.72);--section-pad:clamp(48px,8vw,120px);--grid-gap:clamp(32px,4vw,64px);--font-display:"Unbounded",system-ui,sans-serif;--font-body:"Plus Jakarta Sans",system-ui,sans-serif}`;
}


/**
 * ponytail: Figma fallback — when no *-mockup / mockup-homepage / composite exists,
 * reuse live screenshot with CSS blur+desaturate as «Макет» layer.
 */
function resolveComparison(mockups, imgs, project) {
  if (project.comparisonImages?.live && project.comparisonImages?.mockup) {
    return { liveSrc: project.comparisonImages.live, mockupSrc: project.comparisonImages.mockup, mockupFallback: false };
  }
  const live = mockups.find((m) => /05-desktop-full/.test(m.name)) ?? mockups.find((m) => /^01-hero/.test(m.name)) ?? imgs.desktop ?? imgs.hero;
  const mockup = mockups.find((m) => /mockup-homepage-desktop|homepage-desktop-mockup|desktop-mockup|composite/i.test(m.name) && !/pricing|mobile/i.test(m.name)) ?? mockups.find((m) => /mockup.*desktop/i.test(m.name) && !/pricing/i.test(m.name));
  return { liveSrc: live?.src ?? "", mockupSrc: mockup?.src ?? live?.src ?? "", mockupFallback: !mockup };
}

function highlightCode(code, lang) {
  return code.split("\n").map((line, i) => {
    let h = esc(line);
    if (lang === "html") {
      h = h.replace(/([\w-]+)(=)(&quot;[^&]*&quot;)/g, '<span class="tok-attr">$1</span>$2<span class="tok-str">$3</span>');
      h = h.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-tag">$2</span>');
    } else if (lang === "css") {
      h = h.replace(/^(\s*)([.#:][\w-]+)/, '$1<span class="tok-tag">$2</span>');
      h = h.replace(/(--[\w-]+)/g, '<span class="tok-var">$1</span>');
      h = h.replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="tok-num">$1</span>');
    } else {
      h = h.replace(/\b(import|from|const|let|async|await|function|return|new|class)\b/g, '<span class="tok-kw">$1</span>');
      h = h.replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="tok-str">$1</span>');
      h = h.replace(/(#.*)$/, '<span class="tok-cm">$1</span>');
    }
    return `<div class="code-line" style="--line:${i}">${h || "&nbsp;"}</div>`;
  }).join("");
}

function buildComparisonSection(cmp, tooltips) {
  if (!cmp.liveSrc) return "";
  const mockupCls = cmp.mockupFallback ? " compare-mockup--fallback" : "";
  const hints = (tooltips ?? []).map((t) => `<span class="compare-hint" data-tip="${esc(t)}">${esc(t)}</span>`).join("");
  const fb = cmp.mockupFallback ? ' <span class="muted">(ponytail: нет Figma — дизайн-слой из live)</span>' : "";
  return `<section class="section compare-section" id="comparison"><div class="section-inner"><div class="reveal"><p class="eyebrow">Pixel-perfect</p><h2 class="section-title">Макет и готовый сайт</h2><p class="lead">Сравните дизайн и production — перетащите ползунок.${fb}</p></div><div class="compare-labels reveal"><span><strong>Макет</strong> · дизайн</span><span><strong>Готовый сайт</strong> · production</span></div><figure class="compare-wrap reveal tilt-card" data-compare><div class="compare-layer compare-live"><img src="${esc(cmp.liveSrc)}" alt="Готовый сайт" width="1440" height="900" loading="lazy"/></div><div class="compare-layer compare-mockup${mockupCls}"><img src="${esc(cmp.mockupSrc)}" alt="Макет" width="1440" height="900" loading="lazy"/></div><div class="compare-handle" aria-hidden="true"></div><input type="range" class="compare-range" min="0" max="100" value="50" aria-label="Сравнение макета и сайта"/></figure>${hints ? `<div class="compare-hints reveal">${hints}</div>` : ""}</div></section>`;
}

function buildParallaxSection(parallaxItems) {
  if (!parallaxItems.length) return "";
  const speeds = [0.1, 0.2, 0.35, 0.25];
  const cards = parallaxItems.slice(0, 4).map((m, i) => `<article class="parallax-card" data-speed="${speeds[i] ?? 0.2}"><img src="${esc(m.src)}" alt="${esc(figLabel(m.name))}" width="1440" height="900" loading="lazy"/></article>`).join("");
  return `<section class="section parallax-section" id="parallax"><div class="section-inner"><div class="reveal"><p class="eyebrow">Глубина</p><h2 class="section-title">Каскад внутренних экранов</h2><p class="lead">Parallax-слои при скролле — разная скорость каждой карточки.</p></div><div class="parallax-stage reveal">${cards}</div></div></section>`;
}

function buildUnderTheHood(p) {
  const snippets = p.codeSnippets ?? { html: `<section id="hero"><h1>${p.title}</h1></section>`, css: `:root { --accent: ${p.accent}; }`, js: `console.log("${p.repo}");` };
  const scores = p.pageSpeedScores ?? { perf: 95, a11y: 90, seo: 98 };
  const tabs = [{ id: "html", label: "HTML" }, { id: "css", label: "CSS" }, { id: "js", label: "JS" }];
  const panes = tabs.map((t, i) => `<pre class="code-pane${i === 0 ? " is-active" : ""}" data-pane="${t.id}"><code>${highlightCode(snippets[t.id] ?? "", t.id)}</code></pre>`).join("");
  const tabBtns = tabs.map((t, i) => `<button type="button" class="code-tab${i === 0 ? " is-active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("");
  const ring = (label, score) => { const offset = 251.2 - (score / 100) * 251.2; return `<div class="ps-ring-wrap"><div class="ps-ring" data-score="${score}" style="--ps-offset:${offset}"><svg viewBox="0 0 88 88" aria-hidden="true"><circle class="ps-ring-bg" cx="44" cy="44" r="40"/><circle class="ps-ring-fill" cx="44" cy="44" r="40"/></svg><span class="ps-ring-val">0</span></div><span class="ps-ring-label">${label}</span></div>`; };
  return `<section class="section" id="under-the-hood"><div class="section-inner"><div class="reveal"><p class="eyebrow">Under the Hood</p><h2 class="section-title">Код и PageSpeed</h2><p class="lead">Фрагменты production-кода и Lighthouse-метрики.</p></div><div class="hood-grid"><div class="code-window reveal tilt-card"><div class="code-chrome"><span class="code-dot code-dot--r"></span><span class="code-dot code-dot--y"></span><span class="code-dot code-dot--g"></span><div class="code-tabs">${tabBtns}</div></div><div class="code-body">${panes}</div></div><aside class="pagespeed-panel reveal"><p class="eyebrow" style="margin-bottom:8px">Lighthouse</p><div class="pagespeed-rings">${ring("Performance", scores.perf)}${ring("Accessibility", scores.a11y)}${ring("SEO", scores.seo)}</div></aside></div></div></section>`;
}

/** @param {string} label */
function figLabel(name) {
  return name.replace(/\.(png|jpg|webp)$/i, "").replace(/^\d+-/, "").replace(/-/g, " ");
}

/** @param {{ src: string, name: string } | undefined} img @param {number} w @param {number} h */
function imgTag(img, w = 1440, h = 900, opts = {}) {
  if (!img) return "";
  const cls = opts.lightbox === false ? "" : ' class="lightbox-trigger"';
  return `<img src="${esc(img.src)}" alt="${esc(figLabel(img.name))}" width="${w}" height="${h}" loading="lazy"${cls}/>`;
}

function phoneScrollFrame(img) {
  if (!img) return "";
  return `<div class="phone-scroll-wrap"><div class="phone-frame phone-frame--device"><div class="phone-notch"></div><div class="phone-screen phone-screen--scroll"><img src="${esc(img.src)}" alt="${esc(figLabel(img.name))}" class="phone-scroll-img lightbox-trigger" width="390" loading="lazy"/></div><div class="phone-bar"></div></div><button type="button" class="phone-scroll-btn" aria-label="Auto scroll"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg><span>Scroll demo</span></button></div>`;
}

/** @param {import('./presentation-data.mjs').Project} p @param {ReturnType<typeof categorizeMockups>} imgs */
function buildCaseStudy(p, imgs, mockups) {
  const live = Boolean(p.demoUrl && !p.demoUrl.includes("github.com"));
  const host = live ? new URL(p.demoUrl).hostname : p.repo + ".vercel.app";
  const palette = defaultPalette(p);
  const fontDisplay = p.fontDisplay ?? "Unbounded";
  const fontBody = p.fontBody ?? "Plus Jakarta Sans";
  const cmp = resolveComparison(mockups, imgs, p);
  const parallaxItems = imgs.sections.length > 0 ? imgs.sections : imgs.gallery.filter((m) => /section|desktop|hero/i.test(m.name)).slice(0, 4);

  const heroVisual = imgs.hero
    ? `<div class="hero-visual reveal tilt-card">${imgTag(imgs.hero)}</div>`
    : `<div class="placeholder-visual reveal"><p>Визуалы появятся после capture-скрипта.<br/><a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub → ${esc(p.repo)}</a></p></div>`;

  const galleryCards = (items) =>
    items
      .map(
        (m) =>
          `<figure class="gallery-card tilt-card"><img class="lightbox-trigger" src="${esc(m.src)}" alt="${esc(figLabel(m.name))}" width="1440" height="900" loading="lazy"/><figcaption>${esc(figLabel(m.name))}</figcaption></figure>`,
      )
      .join("");

  const sectionGallery =
    imgs.gallery.length > 0
      ? `<div class="gallery-group reveal"><p class="gallery-label">Концепт и внутренние страницы</p><div class="gallery-row gallery-row--hover">${galleryCards(imgs.gallery)}</div></div>`
      : "";

  const deviceGallery =
    imgs.desktop || imgs.mobile
      ? `<div class="gallery-group reveal"><p class="gallery-label">Адаптив и устройства</p><div class="device-showcase tilt-card reveal"><div class="device-showcase__grid-bg" aria-hidden="true"></div><div class="device-row device-row--dual device-showcase__stage">${imgs.desktop ? `<div class="device-showcase__browser" data-depth="0.04"><div class="browser-frame tilt-card"><div class="browser-chrome"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span><div class="url-bar">${esc(host)}</div></div>${imgTag(imgs.desktop)}</div></div>` : ""}${imgs.mobile ? `<div class="device-showcase__phone" data-depth="0.08">${phoneScrollFrame(imgs.mobile)}</div>` : ""}</div></div></div>`
      : "";

  const swatches = palette
    .map(
      (c) =>
        `<div class="swatch"><div class="swatch-color" style="background:${esc(c.hex)}"></div><div class="swatch-info"><strong>${esc(c.name)}</strong>${esc(c.hex)}</div></div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(p.title)} — Case Study</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../_assets/case-study.css"/>
<style>${cssVars(p)}:root{--font-display:"${esc(fontDisplay)}",system-ui,sans-serif;--font-body:"${esc(fontBody)}",system-ui,sans-serif}</style>
</head>
<body>
<div class="mesh"></div>
<div class="noise"></div>
<a class="back-link" href="../index.html">← Портфолио</a>
<main class="page">
<section class="section hero" id="hero">
<div class="section-inner hero-grid">
<div>
<p class="eyebrow reveal">${esc(p.type)} · ${p.year}</p>
<h1 class="display reveal">${esc(p.title)}</h1>
<p class="lead reveal" style="margin-top:20px">${esc(p.tagline)}</p>
<p class="lead reveal" style="margin-top:16px;font-size:1rem">${esc(p.overview.split(".")[0] + ".")}</p>
<div class="hero-meta reveal stagger-parent">${p.techs.map((t, i) => `<span class="pill pill--accent stagger-item" style="--i:${i}">${esc(t)}</span>`).join("")}<span class="pill stagger-item ${live ? "pill--live" : ""}" style="--i:${p.techs.length}">${live ? "● LIVE" : "○ CODE"}</span></div>
</div>
${heroVisual}
</div>
</section>

<section class="section" id="design-system">
<div class="section-inner">
<div class="reveal"><p class="eyebrow">Design System</p><h2 class="section-title">Палитра и типографика</h2></div>
<div class="ds-grid">
<div class="reveal"><div class="swatches">${swatches}</div></div>
<div class="type-demo reveal">
<p class="type-display">${esc(p.title)}</p>
<p class="type-body"><span>Display — ${esc(fontDisplay)}.</span> Body — ${esc(fontBody)}. Премиальная тёмная эстетика с неоновым акцентом <span>${esc(p.accent)}</span> для ${esc(p.type.toLowerCase())}.</p>
</div>
</div>
</div>
</section>

${buildComparisonSection(cmp, p.comparisonTooltips)}

<section class="section gallery-section" id="gallery">
<div class="section-inner">
<div class="reveal"><p class="eyebrow">Визуал</p><h2 class="section-title">Скриншоты и flow</h2><p class="lead">От главного концепта к внутренним страницам, мобильной версии и интерактивным модулям.</p></div>
${sectionGallery}
${deviceGallery}
</div>
</section>

${buildParallaxSection(parallaxItems)}

${buildUnderTheHood(p)}

<section class="section" id="problem-solution">
<div class="section-inner">
<div class="reveal"><p class="eyebrow">Задача</p><h2 class="section-title">Проблема и решение</h2></div>
<div class="ps-grid">
<div class="ps-card ps-card--problem reveal"><h3>Проблема</h3><p>${esc(p.problem)}</p></div>
<div class="ps-card ps-card--solution reveal"><h3>Решение</h3><p>${esc(p.solution)}</p></div>
</div>
</div>
</section>

<section class="section" id="metrics">
<div class="section-inner">
<div class="reveal"><p class="eyebrow">Результаты</p><h2 class="section-title">Метрики</h2></div>
<div class="metrics-grid">${p.metrics.map((m) => `<div class="metric-card reveal"><div class="metric-value">${esc(m.value)}</div><div class="metric-label">${esc(m.label)}</div>${m.desc ? `<p class="metric-desc">${esc(m.desc)}</p>` : ""}</div>`).join("")}</div>
</div>
</section>

<section class="section cta-section" id="cta">
<div class="section-inner cta-inner">
<div class="reveal"><p class="eyebrow">Ссылки</p><h2 class="section-title">Демо и репозиторий</h2></div>
<div class="link-stack reveal stagger-parent">${live ? `<a class="link-btn link-btn--primary stagger-item" style="--i:0" href="${esc(p.demoUrl)}" target="_blank" rel="noopener noreferrer">Запустить демо</a>` : ""}<a class="link-btn stagger-item" style="--i:${live ? 1 : 0}" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub → ${esc(p.repo)}</a></div>
<p class="footer-note reveal">${esc(p.repo)} · ${p.year} · ${esc(p.title)}</p>
</div>
</section>
</main>
<div id="screenshot-lightbox" class="lightbox" hidden>
<button type="button" class="lightbox-close" aria-label="Закрыть">&times;</button>
<img class="lightbox-img" alt=""/>
</div>
<script src="../_assets/case-study.js" defer></script>
</body>
</html>`;
}

/** @param {{ slug: string, title: string, tagline: string, type: string, language: string, hasDemo: boolean, thumb?: string, accent: string }[]} items */
function buildIndex(items) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Портфолио — Case Studies</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Unbounded:wght@600;700&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#050508;--text:#f1f5f9;--muted:#94a3b8;--cyan:#22d3ee;--border:rgba(148,163,184,.12)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Plus Jakarta Sans",system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.noise{position:fixed;inset:0;pointer-events:none;opacity:.3;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")}
.mesh{position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(34,211,238,.12),transparent),radial-gradient(ellipse 60% 40% at 100% 100%,rgba(167,139,250,.08),transparent)}
.wrap{position:relative;max-width:1400px;margin:0 auto;padding:clamp(48px,8vw,120px) clamp(20px,4vw,48px) 80px}
header{text-align:center;margin-bottom:clamp(48px,6vw,80px)}
header h1{font-family:"Unbounded",system-ui,sans-serif;font-size:clamp(2.2rem,5vw,3.5rem);font-weight:700;letter-spacing:-.03em;background:linear-gradient(135deg,#fff,var(--cyan),#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
header p{color:var(--muted);margin-top:14px;font-size:1.05rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:clamp(20px,3vw,32px)}
.card{display:grid;text-decoration:none;color:inherit;border-radius:24px;border:1px solid var(--border);background:rgba(12,12,20,.75);overflow:hidden;transition:transform .3s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .3s}
.card:hover{transform:translateY(-6px);border-color:color-mix(in srgb,var(--card-accent,#22d3ee) 45%,transparent);box-shadow:0 25px 50px -12px rgba(0,0,0,.5),0 0 60px color-mix(in srgb,var(--card-accent,#22d3ee) 15%,transparent)}
.card-thumb{aspect-ratio:16/10;background:#0c0c14;overflow:hidden;position:relative}
.card-thumb img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.card:hover .card-thumb img{transform:scale(1.05)}
.card-thumb--empty{display:flex;align-items:center;justify-content:center;font-family:"Unbounded",system-ui,sans-serif;font-size:2rem;font-weight:700;color:var(--card-accent,#22d3ee);opacity:.5}
.card-body{padding:24px 28px 28px;display:grid;gap:8px}
.card-type{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--card-accent,#22d3ee)}
.card h2{font-family:"Unbounded",system-ui,sans-serif;font-size:1.2rem;font-weight:600;letter-spacing:-.02em}
.card p{color:var(--muted);font-size:.9rem;line-height:1.5}
.card-meta{display:flex;gap:14px;margin-top:6px;font-size:.72rem;color:var(--muted)}
footer{text-align:center;margin-top:clamp(48px,6vw,72px);color:var(--muted);font-size:.85rem}
</style>
</head>
<body>
<div class="mesh"></div>
<div class="noise"></div>
<div class="wrap">
<header>
<h1>Портфолио · Case Studies</h1>
<p>${items.length} премиальных scroll-кейсов · comparison · parallax · code · ${new Date().getFullYear()}</p>
</header>
<div class="grid">${items
    .map((p) => {
      const thumb = p.thumb
        ? `<div class="card-thumb"><img src="${esc(p.thumb)}" alt="${esc(p.title)}" width="640" height="400" loading="lazy"/></div>`
        : `<div class="card-thumb card-thumb--empty">${esc(p.title.slice(0, 2))}</div>`;
      return `<a class="card" href="${esc(p.slug)}/index.html" style="--card-accent:${esc(p.accent)}">${thumb}<div class="card-body"><span class="card-type">${esc(p.type)}</span><h2>${esc(p.title)}</h2><p>${esc(p.tagline)}</p><div class="card-meta"><span>${p.hasDemo ? "● LIVE" : "○ CODE"}</span><span>${esc(p.language)}</span></div></div></a>`;
    })
    .join("")}</div>
<footer>comparison slider · parallax cascade · Under the Hood · lightbox · tilt</footer>
</div>
</body>
</html>`;
}

// Write shared assets (source: scripts/presentation-assets/)
const ASSET_SRC = join(__dirname, "presentation-assets");
await mkdir(ASSETS, { recursive: true });
const caseCss = await readFile(join(ASSET_SRC, "case-study.css"), "utf8");
await writeFile(join(ASSETS, "case-study.css"), caseCss, "utf8");
const caseJs = await readFile(join(ASSET_SRC, "case-study.js"), "utf8");
await writeFile(join(ASSETS, "case-study.js"), caseJs, "utf8");

const indexItems = [];
let fileCount = 2;

for (const project of PROJECTS) {
  const dir = join(OUT_ROOT, project.slug);
  await mkdir(dir, { recursive: true });
  const mockups = await findMockups(project.slug, project.mockupDirs);
  const imgs = categorizeMockups(mockups);
  const html = buildCaseStudy(project, imgs, mockups);
  await writeFile(join(dir, "index.html"), html, "utf8");
  fileCount++;
  const thumbFile = imgs.hero?.name ?? imgs.gallery[0]?.name;
  const thumb = thumbFile ? "../portfolio-mockups/" + project.slug + "/" + thumbFile : undefined;
  indexItems.push({
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    type: project.type,
    language: project.language,
    hasDemo: Boolean(project.demoUrl && !project.demoUrl.includes("github.com")),
    thumb,
    accent: project.accent ?? "#22d3ee",
  });
  console.log("ok " + project.slug + " (" + mockups.length + " mockups)");
}

await writeFile(join(OUT_ROOT, "index.html"), buildIndex(indexItems), "utf8");
fileCount++;

const manifest = {
  generatedAt: new Date().toISOString(),
  outputDir: OUT_ROOT,
  format: "scroll-case-study",
  sectionOrder: ["hero","design-system","comparison","gallery","parallax","under-the-hood","problem-solution","metrics","cta"],
  figmaFallback: "ponytail: no Figma PNG → live screenshot with CSS blur/desaturate as mockup layer",
  effects: [
    "gradient mesh background",
    "SVG noise texture",
    "scroll reveal (Intersection Observer)",
    "image comparison slider",
    "parallax cascade",
    "code editor tabs + PageSpeed rings",
    "lightbox zoom",
    "phone scroll frame",
    "3D tilt cards",
    "fade up + scale + blur reveal",
    "gallery hover (siblings blur/opacity)",
    "device frames (laptop + phone)",
    "glass glare overlay",
    "neon glow accents",
    "CSS Grid layout",
    "smooth scroll",
    "prefers-reduced-motion",
    "lazy-loaded images",
  ],
  projects: PROJECTS.map((p) => ({
    slug: p.slug,
    accent: p.accent,
    repo: p.repo,
    demoUrl: p.demoUrl,
    githubUrl: p.githubUrl,
    live: Boolean(p.demoUrl && !p.demoUrl.includes("github.com")),
  })),
  fileCount,
};
await writeFile(join(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
fileCount++;
console.log("Done: " + fileCount + " files -> " + OUT_ROOT);
