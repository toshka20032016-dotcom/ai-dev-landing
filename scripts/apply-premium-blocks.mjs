/**
 * Patches generate-presentations.mjs with premium interactive blocks.
 * Run: node scripts/apply-premium-blocks.mjs && node scripts/enrich-presentation-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const genPath = join(__dirname, "generate-presentations.mjs");
let gen = readFileSync(genPath, "utf8");

function rep(from, to) {
  if (gen.includes(from)) gen = gen.replace(from, to);
  else {
    const fc = from.replace(/\n/g, "\r\n");
    const tc = to.replace(/\n/g, "\r\n");
    if (gen.includes(fc)) gen = gen.replace(fc, tc);
  }
}

if (!gen.includes("buildComparisonSection")) {
  const anchor = "/** @param {string} label */\nfunction figLabel(name) {";
  const newFns = `/**
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
  return code.split("\\n").map((line, i) => {
    let h = esc(line);
    if (lang === "html") {
      h = h.replace(/(&lt;\\/?)([\\w-]+)/g, '$1<span class="tok-tag">$2</span>');
      h = h.replace(/([\\w-]+)(=)/g, '<span class="tok-attr">$1</span>$2');
      h = h.replace(/(&quot;[^&]*&quot;)/g, '<span class="tok-str">$1</span>');
    } else if (lang === "css") {
      h = h.replace(/^(\\s*)([.#:][\\w-]+)/, '$1<span class="tok-tag">$2</span>');
      h = h.replace(/(--[\\w-]+)/g, '<span class="tok-var">$1</span>');
      h = h.replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="tok-num">$1</span>');
    } else {
      h = h.replace(/\\b(import|from|const|let|async|await|function|return|new|class)\\b/g, '<span class="tok-kw">$1</span>');
      h = h.replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="tok-str">$1</span>');
      h = h.replace(/(#.*)$/, '<span class="tok-cm">$1</span>');
    }
    return \`<div class="code-line" style="--line:\${i}">\${h || "&nbsp;"}</div>\`;
  }).join("");
}

function buildComparisonSection(cmp, tooltips) {
  if (!cmp.liveSrc) return "";
  const mockupCls = cmp.mockupFallback ? " compare-mockup--fallback" : "";
  const hints = (tooltips ?? []).map((t) => \`<span class="compare-hint" data-tip="\${esc(t)}">\${esc(t)}</span>\`).join("");
  const fb = cmp.mockupFallback ? ' <span class="muted">(ponytail: нет Figma — дизайн-слой из live)</span>' : "";
  return \`<section class="section compare-section" id="comparison"><div class="section-inner"><div class="reveal"><p class="eyebrow">Pixel-perfect</p><h2 class="section-title">Макет и готовый сайт</h2><p class="lead">Сравните дизайн и production — перетащите ползунок.\${fb}</p></div><div class="compare-labels reveal"><span><strong>Макет</strong> · дизайн</span><span><strong>Готовый сайт</strong> · production</span></div><figure class="compare-wrap reveal tilt-card" data-compare><div class="compare-layer compare-live"><img src="\${esc(cmp.liveSrc)}" alt="Готовый сайт" width="1440" height="900" loading="lazy"/></div><div class="compare-layer compare-mockup\${mockupCls}"><img src="\${esc(cmp.mockupSrc)}" alt="Макет" width="1440" height="900" loading="lazy"/></div><div class="compare-handle" aria-hidden="true"></div><input type="range" class="compare-range" min="0" max="100" value="50" aria-label="Сравнение макета и сайта"/></figure>\${hints ? \`<div class="compare-hints reveal">\${hints}</div>\` : ""}</div></section>\`;
}

function buildParallaxSection(parallaxItems) {
  if (!parallaxItems.length) return "";
  const speeds = [0.1, 0.2, 0.35, 0.25];
  const cards = parallaxItems.slice(0, 4).map((m, i) => \`<article class="parallax-card" data-speed="\${speeds[i] ?? 0.2}"><img src="\${esc(m.src)}" alt="\${esc(figLabel(m.name))}" width="1440" height="900" loading="lazy"/></article>\`).join("");
  return \`<section class="section parallax-section" id="parallax"><div class="section-inner"><div class="reveal"><p class="eyebrow">Глубина</p><h2 class="section-title">Каскад внутренних экранов</h2><p class="lead">Parallax-слои при скролле — разная скорость каждой карточки.</p></div><div class="parallax-stage reveal">\${cards}</div></div></section>\`;
}

function buildUnderTheHood(p) {
  const snippets = p.codeSnippets ?? { html: \`<section id="hero"><h1>\${p.title}</h1></section>\`, css: \`:root { --accent: \${p.accent}; }\`, js: \`console.log("\${p.repo}");\` };
  const scores = p.pageSpeedScores ?? { perf: 95, a11y: 90, seo: 98 };
  const tabs = [{ id: "html", label: "HTML" }, { id: "css", label: "CSS" }, { id: "js", label: "JS" }];
  const panes = tabs.map((t, i) => \`<pre class="code-pane\${i === 0 ? " is-active" : ""}" data-pane="\${t.id}"><code>\${highlightCode(snippets[t.id] ?? "", t.id)}</code></pre>\`).join("");
  const tabBtns = tabs.map((t, i) => \`<button type="button" class="code-tab\${i === 0 ? " is-active" : ""}" data-tab="\${t.id}">\${t.label}</button>\`).join("");
  const ring = (label, score) => { const offset = 251.2 - (score / 100) * 251.2; return \`<div class="ps-ring-wrap"><div class="ps-ring" data-score="\${score}" style="--ps-offset:\${offset}"><svg viewBox="0 0 88 88" aria-hidden="true"><circle class="ps-ring-bg" cx="44" cy="44" r="40"/><circle class="ps-ring-fill" cx="44" cy="44" r="40"/></svg><span class="ps-ring-val">0</span></div><span class="ps-ring-label">\${label}</span></div>\`; };
  return \`<section class="section" id="under-the-hood"><div class="section-inner"><div class="reveal"><p class="eyebrow">Under the Hood</p><h2 class="section-title">Код и PageSpeed</h2><p class="lead">Фрагменты production-кода и Lighthouse-метрики.</p></div><div class="hood-grid"><div class="code-window reveal tilt-card"><div class="code-chrome"><span class="code-dot code-dot--r"></span><span class="code-dot code-dot--y"></span><span class="code-dot code-dot--g"></span><div class="code-tabs">\${tabBtns}</div></div><div class="code-body">\${panes}</div></div><aside class="pagespeed-panel reveal"><p class="eyebrow" style="margin-bottom:8px">Lighthouse</p><div class="pagespeed-rings">\${ring("Performance", scores.perf)}\${ring("Accessibility", scores.a11y)}\${ring("SEO", scores.seo)}</div></aside></div></div></section>\`;
}

`;

  const anchorCrlf = anchor.replace(/\n/g, "\r\n");
  if (gen.includes(anchor)) gen = gen.replace(anchor, newFns + anchor);
  else if (gen.includes(anchorCrlf)) gen = gen.replace(anchorCrlf, newFns.replace(/\n/g, "\r\n") + anchorCrlf);
  else throw new Error("figLabel anchor not found");
}

// External assets instead of embedded minified CSS/JS
if (gen.includes("const CASE_STUDY_CSS =")) {
  gen = gen.replace(
    /const CASE_STUDY_CSS = `[\s\S]*?`;\s*\n\s*const CASE_STUDY_JS = `[\s\S]*?`;/,
    `const ASSET_SRC = join(__dirname, "presentation-assets");`,
  );
  gen = gen.replace(
    'import { mkdir, writeFile, readdir } from "node:fs/promises";',
    'import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";',
  );
  gen = gen.replace(
    /await writeFile\(join\(ASSETS, "case-study\.css"\), CASE_STUDY_CSS, "utf8"\);\s*await writeFile\(join\(ASSETS, "case-study\.js"\), CASE_STUDY_JS, "utf8"\);/,
    `const caseCss = await readFile(join(ASSET_SRC, "case-study.css"), "utf8");
await writeFile(join(ASSETS, "case-study.css"), caseCss, "utf8");
const caseJs = await readFile(join(ASSET_SRC, "case-study.js"), "utf8");
await writeFile(join(ASSETS, "case-study.js"), caseJs, "utf8");`,
  );
}

// buildCaseStudy signature + sections
gen = gen.replace(
  "function buildCaseStudy(p, imgs) {",
  "function buildCaseStudy(p, imgs, mockups) {",
);
if (!gen.includes("const cmp = resolveComparison")) {
  rep(
    `  const fontBody = p.fontBody ?? "Plus Jakarta Sans";

  const heroVisual`,
    `  const fontBody = p.fontBody ?? "Plus Jakarta Sans";
  const cmp = resolveComparison(mockups, imgs, p);
  const parallaxItems = imgs.sections.length > 0 ? imgs.sections : imgs.gallery.filter((m) => /section|desktop|hero/i.test(m.name)).slice(0, 4);

  const heroVisual`,
  );
}

gen = gen.replace(
  '<div class="hero-visual reveal">',
  '<div class="hero-visual reveal tilt-card">',
);
gen = gen.replace(
  '<figure class="gallery-card"><img class="lightbox-trigger"',
  '<figure class="gallery-card tilt-card"><img class="lightbox-trigger"',
);
gen = gen.replace(
  '<div class="browser-frame"><div class="browser-chrome">',
  '<div class="browser-frame tilt-card"><div class="browser-chrome">',
);
gen = gen.replace(
  'return `<div class="phone-frame phone-frame--device">',
  'return `<div class="phone-frame phone-frame--device tilt-card">',
);

// Section order: after design-system, before gallery
if (!gen.includes("${buildComparisonSection(cmp")) {
  rep(
    `</section>

<section class="section gallery-section" id="gallery">`,
    `</section>

\${buildComparisonSection(cmp, p.comparisonTooltips)}

<section class="section gallery-section" id="gallery">`,
  );
  rep(
    `\${deviceGallery}
</div>
</section>

<section class="section" id="problem-solution">`,
    `\${deviceGallery}
</div>
</section>

\${buildParallaxSection(parallaxItems)}

\${buildUnderTheHood(p)}

<section class="section" id="problem-solution">`,
  );
}

// Lightbox + JetBrains font
if (!gen.includes("screenshot-lightbox")) {
  gen = gen.replace(
    `</main>
<script src="../_assets/case-study.js" defer></script>`,
    `</main>
<div id="screenshot-lightbox" class="lightbox" hidden>
<button type="button" class="lightbox-close" aria-label="Закрыть">&times;</button>
<img class="lightbox-img" alt=""/>
</div>
<script src="../_assets/case-study.js" defer></script>`,
  );
}
gen = gen.replace(
  "family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Unbounded",
  "family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Unbounded",
);

// buildCaseStudy call
gen = gen.replace(
  "const html = buildCaseStudy(project, imgs);",
  "const html = buildCaseStudy(project, imgs, mockups);",
);

// Index + manifest
gen = gen.replace(
  "премиальных scroll-кейсов · Awwwards-level",
  "премиальных scroll-кейсов · comparison · parallax · code",
);
gen = gen.replace(
  "Scroll-based case studies · Plus Jakarta Sans + Unbounded",
  "comparison slider · parallax cascade · Under the Hood · lightbox · tilt",
);

if (!gen.includes("sectionOrder")) {
  gen = gen.replace(
    'format: "scroll-case-study",',
    `format: "scroll-case-study",
  sectionOrder: ["hero","design-system","comparison","gallery","parallax","under-the-hood","problem-solution","metrics","cta"],
  figmaFallback: "ponytail: no Figma PNG → live screenshot with CSS blur/desaturate as mockup layer",`,
  );
  gen = gen.replace(
    '"scroll reveal (Intersection Observer)",',
    `"scroll reveal (Intersection Observer)",
    "image comparison slider",
    "parallax cascade",
    "code editor tabs + PageSpeed rings",
    "lightbox zoom",
    "phone scroll frame",
    "3D tilt cards",`,
  );
}

writeFileSync(genPath, gen, "utf8");
console.log("patched generate-presentations.mjs", gen.length);
