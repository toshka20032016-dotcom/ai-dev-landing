import { mkdir, writeFile, readdir } from "node:fs/promises";
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

const CASE_STUDY_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:var(--font-body);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}img{display:block;max-width:100%;height:auto}a{color:inherit}.noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")}.mesh{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 15% 0%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 55%),radial-gradient(ellipse 60% 45% at 85% 100%,color-mix(in srgb,var(--accent2) 14%,transparent),transparent 50%),var(--bg)}.page{position:relative;z-index:1}.section{padding:var(--section-pad) clamp(20px,4vw,48px)}.section-inner{max-width:1280px;margin:0 auto;display:grid;gap:var(--grid-gap)}.eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:16px}.display{font-family:var(--font-display);font-size:clamp(2.5rem,6vw,5rem);font-weight:700;letter-spacing:-.04em;line-height:1.02;background:linear-gradient(135deg,#fff 15%,var(--accent) 50%,var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.section-title{font-family:var(--font-display);font-size:clamp(1.75rem,3.5vw,2.75rem);font-weight:600;letter-spacing:-.03em;line-height:1.1;margin-bottom:8px}.lead{font-size:clamp(1rem,1.5vw,1.2rem);color:#cbd5e1;max-width:720px;line-height:1.75}.muted{color:var(--muted)}.reveal{opacity:0;transform:translateY(28px) scale(.97);filter:blur(8px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1),filter .7s cubic-bezier(.22,1,.36,1)}.reveal.is-visible{opacity:1;transform:none;filter:blur(0)}.hero{min-height:100svh;display:grid;align-items:center;padding-top:clamp(80px,12vh,140px);padding-bottom:var(--section-pad)}.hero-grid{display:grid;gap:var(--grid-gap);align-items:center}@media(min-width:900px){.hero-grid{grid-template-columns:1fr 1.1fr}}.hero-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.pill{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;padding:8px 16px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.03)}.pill--accent{border-color:color-mix(in srgb,var(--accent) 45%,transparent);color:var(--accent);box-shadow:0 0 24px color-mix(in srgb,var(--accent) 20%,transparent)}.pill--live{border-color:color-mix(in srgb,var(--accent2) 45%,transparent);color:var(--accent2)}.hero-visual{position:relative;border-radius:20px;overflow:hidden;border:1px solid var(--border);box-shadow:0 25px 50px -12px rgba(0,0,0,.5),0 0 80px color-mix(in srgb,var(--accent) 15%,transparent)}.hero-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 40%,transparent 60%,rgba(255,255,255,.04) 100%);pointer-events:none}.hero-visual img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top}.ds-grid{display:grid;gap:var(--grid-gap)}@media(min-width:768px){.ds-grid{grid-template-columns:1fr 1fr}}.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:16px}.swatch{border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--surface)}.swatch-color{aspect-ratio:1.2}.swatch-info{padding:12px 14px;font-size:.75rem}.swatch-info strong{display:block;font-size:.8rem;margin-bottom:2px}.type-demo{padding:32px;border-radius:20px;border:1px solid var(--border);background:var(--glass);backdrop-filter:blur(12px)}.type-display{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:600;margin-bottom:20px;letter-spacing:-.02em}.type-body{font-size:1rem;line-height:1.8;color:#cbd5e1}.type-body span{color:var(--accent)}.gallery-section .section-inner{gap:clamp(40px,5vw,72px)}.gallery-group{display:grid;gap:24px}.gallery-label{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}.gallery-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}.gallery-row--hover{position:relative}.gallery-card{border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--surface);transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .45s ease,filter .45s ease}.gallery-card img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;transition:transform .5s cubic-bezier(.22,1,.36,1)}.gallery-card figcaption{padding:12px 16px;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.gallery-row--hover:has(.gallery-card:hover) .gallery-card:not(:hover){opacity:.45;filter:blur(2px);transform:scale(.97)}.gallery-row--hover .gallery-card:hover{transform:scale(1.03);z-index:2;box-shadow:0 25px 50px -12px rgba(0,0,0,.5),0 0 40px color-mix(in srgb,var(--accent) 20%,transparent)}.gallery-row--hover .gallery-card:hover img{transform:scale(1.04)}.device-row{display:grid;gap:var(--grid-gap);justify-items:center}@media(min-width:900px){.device-row--dual{grid-template-columns:1.4fr .6fr;align-items:start}}.browser-frame{width:100%;max-width:960px;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,.5),0 0 60px color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid var(--border);background:#111;position:relative}.browser-frame::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 35%);pointer-events:none;z-index:2}.browser-chrome{height:40px;background:linear-gradient(180deg,#2a2a2e,#1e1e22);display:flex;align-items:center;padding:0 14px;gap:7px;border-bottom:1px solid rgba(255,255,255,.06)}.dot{width:11px;height:11px;border-radius:50%}.dot-r{background:#ff5f57}.dot-y{background:#febc2e}.dot-g{background:#28c840}.url-bar{flex:1;margin-left:10px;height:24px;border-radius:6px;background:rgba(0,0,0,.35);font-size:10px;color:rgba(255,255,255,.35);display:flex;align-items:center;padding:0 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.browser-frame img,.phone-frame img{width:100%;object-fit:cover;object-position:top}.phone-frame{width:min(300px,80vw);border-radius:44px;padding:12px;background:linear-gradient(145deg,#3a3a3f,#0d0d10);box-shadow:0 25px 50px -12px rgba(0,0,0,.5),0 0 50px color-mix(in srgb,var(--accent) 15%,transparent);border:1px solid rgba(255,255,255,.1);position:relative}.phone-frame::after{content:"";position:absolute;inset:12px;border-radius:32px;background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 40%);pointer-events:none;z-index:2}.phone-notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:96px;height:26px;background:#0d0d10;border-radius:0 0 16px 16px;z-index:3}.phone-screen{border-radius:32px;overflow:hidden;background:#000}.phone-bar{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:rgba(255,255,255,.35);border-radius:2px;z-index:3}.ps-grid{display:grid;gap:24px}@media(min-width:768px){.ps-grid{grid-template-columns:1fr 1fr}}.ps-card{padding:clamp(24px,4vw,40px);border-radius:20px;border:1px solid var(--border);background:var(--glass);backdrop-filter:blur(12px);line-height:1.75}.ps-card--problem{border-color:color-mix(in srgb,#f472b6 25%,transparent)}.ps-card--solution{border-color:color-mix(in srgb,var(--accent) 30%,transparent);box-shadow:0 0 40px color-mix(in srgb,var(--accent) 8%,transparent)}.ps-card h3{font-family:var(--font-display);font-size:1.1rem;margin-bottom:12px;color:var(--accent)}.ps-card--problem h3{color:#f472b6}.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}.metric-card{padding:clamp(24px,3vw,36px);border-radius:20px;border:1px solid var(--border);background:linear-gradient(160deg,color-mix(in srgb,var(--accent) 8%,transparent),color-mix(in srgb,var(--accent2) 5%,transparent));backdrop-filter:blur(10px)}.metric-value{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.4rem);font-weight:700;color:var(--accent);text-shadow:0 0 30px color-mix(in srgb,var(--accent) 40%,transparent)}.metric-label{font-size:.9rem;font-weight:600;margin-top:6px}.metric-desc{font-size:.8rem;color:var(--muted);margin-top:8px;line-height:1.5}.cta-section{text-align:center;padding-bottom:clamp(80px,12vh,160px)}.cta-inner{display:grid;gap:32px;justify-items:center}.link-stack{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}.link-btn{display:inline-flex;align-items:center;padding:16px 32px;border-radius:14px;text-decoration:none;font-weight:600;font-size:.95rem;border:1px solid var(--border);transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.link-btn:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--accent) 50%,transparent)}.link-btn--primary{background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 30%,transparent),color-mix(in srgb,var(--accent2) 20%,transparent));border-color:color-mix(in srgb,var(--accent) 45%,transparent);box-shadow:0 0 40px color-mix(in srgb,var(--accent) 20%,transparent)}.footer-note{font-size:.8rem;color:var(--muted)}.placeholder-visual{min-height:320px;border-radius:20px;border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;text-align:center;padding:48px;color:var(--muted);background:var(--glass)}.placeholder-visual a{color:var(--accent)}.back-link{position:fixed;top:24px;left:24px;z-index:50;padding:10px 18px;border-radius:999px;font-size:.75rem;text-decoration:none;border:1px solid var(--border);background:rgba(8,8,12,.85);backdrop-filter:blur(10px);transition:border-color .2s,transform .2s}.back-link:hover{border-color:color-mix(in srgb,var(--accent) 45%,transparent);transform:translateX(-2px)}@media(max-width:640px){.back-link{top:12px;left:12px;padding:8px 14px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.reveal{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}.gallery-card,.gallery-card img,.link-btn{transition:none!important}.gallery-row--hover:has(.gallery-card:hover) .gallery-card:not(:hover){opacity:1!important;filter:none!important;transform:none!important}.lightbox-trigger{cursor:zoom-in}.lightbox{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:48px 24px;background:rgba(5,5,8,.92);backdrop-filter:blur(12px);opacity:0;transition:opacity .35s ease}.lightbox.is-active{opacity:1}.lightbox[hidden]{display:none!important}.lightbox-img{max-width:min(96vw,1600px);max-height:92vh;width:auto;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 25px 80px rgba(0,0,0,.65)}.lightbox-close{position:absolute;top:24px;right:24px;z-index:201;width:44px;height:44px;border-radius:999px;border:1px solid var(--border);background:rgba(8,8,12,.85);color:var(--text);font-size:28px;line-height:1;cursor:pointer;transition:border-color .2s,transform .2s}.lightbox-close:hover{border-color:color-mix(in srgb,var(--accent) 45%,transparent);transform:scale(1.05)}body.lightbox-open{overflow:hidden}.phone-frame--device{width:min(300px,80vw)}.phone-screen--scroll{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;height:calc(min(300px,80vw)*(844/390) - 52px);scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.22) transparent}.phone-screen--scroll::-webkit-scrollbar{width:4px}.phone-screen--scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.25);border-radius:4px}.phone-scroll-img{width:100%;height:auto;max-width:none;display:block;object-fit:unset;aspect-ratio:unset;object-position:top}.phone-screen--scroll .phone-scroll-img{object-fit:unset}}`;

const CASE_STUDY_JS = `(function(){var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!reduced){document.querySelectorAll(".reveal").forEach(function(el){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});io.observe(el)})}else{document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("is-visible")})}document.querySelectorAll(".gallery-row--hover").forEach(function(row){row.querySelectorAll(".gallery-card").forEach(function(card){card.addEventListener("mouseenter",function(){row.classList.add("is-hovering")});card.addEventListener("mouseleave",function(){row.classList.remove("is-hovering")})})});var lb=document.getElementById("screenshot-lightbox");if(lb){var lbImg=lb.querySelector(".lightbox-img");var lbClose=lb.querySelector(".lightbox-close");function openLb(src,alt){if(!src)return;lbImg.src=src;lbImg.alt=alt||"";lb.hidden=false;document.body.classList.add("lightbox-open");requestAnimationFrame(function(){lb.classList.add("is-active")})}function closeLb(){lb.classList.remove("is-active");document.body.classList.remove("lightbox-open");setTimeout(function(){lb.hidden=true;lbImg.removeAttribute("src")},280)}document.querySelectorAll(".lightbox-trigger").forEach(function(el){el.addEventListener("click",function(){openLb(el.currentSrc||el.src,el.alt)})});lb.addEventListener("click",function(e){if(e.target===lb)closeLb()});lbClose&&lbClose.addEventListener("click",closeLb);document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!lb.hidden)closeLb()})}})();`;

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
  return `<div class="phone-frame phone-frame--device"><div class="phone-notch"></div><div class="phone-screen phone-screen--scroll"><img src="${esc(img.src)}" alt="${esc(figLabel(img.name))}" class="phone-scroll-img lightbox-trigger" width="390" loading="lazy"/></div><div class="phone-bar"></div></div>`;
}

/** @param {import('./presentation-data.mjs').Project} p @param {ReturnType<typeof categorizeMockups>} imgs */
function buildCaseStudy(p, imgs) {
  const live = Boolean(p.demoUrl && !p.demoUrl.includes("github.com"));
  const host = live ? new URL(p.demoUrl).hostname : p.repo + ".vercel.app";
  const palette = defaultPalette(p);
  const fontDisplay = p.fontDisplay ?? "Unbounded";
  const fontBody = p.fontBody ?? "Plus Jakarta Sans";

  const heroVisual = imgs.hero
    ? `<div class="hero-visual reveal">${imgTag(imgs.hero)}</div>`
    : `<div class="placeholder-visual reveal"><p>Визуалы появятся после capture-скрипта.<br/><a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub → ${esc(p.repo)}</a></p></div>`;

  const galleryCards = (items) =>
    items
      .map(
        (m) =>
          `<figure class="gallery-card"><img class="lightbox-trigger" src="${esc(m.src)}" alt="${esc(figLabel(m.name))}" width="1440" height="900" loading="lazy"/><figcaption>${esc(figLabel(m.name))}</figcaption></figure>`,
      )
      .join("");

  const sectionGallery =
    imgs.gallery.length > 0
      ? `<div class="gallery-group reveal"><p class="gallery-label">Концепт и внутренние страницы</p><div class="gallery-row gallery-row--hover">${galleryCards(imgs.gallery)}</div></div>`
      : "";

  const deviceGallery =
    imgs.desktop || imgs.mobile
      ? `<div class="gallery-group reveal"><p class="gallery-label">Адаптив и устройства</p><div class="device-row device-row--dual">${imgs.desktop ? `<div class="browser-frame"><div class="browser-chrome"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span><div class="url-bar">${esc(host)}</div></div>${imgTag(imgs.desktop)}</div>` : ""}${imgs.mobile ? phoneScrollFrame(imgs.mobile) : ""}</div></div>`
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
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet"/>
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
<div class="hero-meta reveal">${p.techs.map((t) => `<span class="pill pill--accent">${esc(t)}</span>`).join("")}<span class="pill ${live ? "pill--live" : ""}">${live ? "● LIVE" : "○ CODE"}</span></div>
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

<section class="section gallery-section" id="gallery">
<div class="section-inner">
<div class="reveal"><p class="eyebrow">Визуал</p><h2 class="section-title">Скриншоты и flow</h2><p class="lead">От главного концепта к внутренним страницам, мобильной версии и интерактивным модулям.</p></div>
${sectionGallery}
${deviceGallery}
</div>
</section>

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
<div class="link-stack reveal">${live ? `<a class="link-btn link-btn--primary" href="${esc(p.demoUrl)}" target="_blank" rel="noopener noreferrer">Запустить демо</a>` : ""}<a class="link-btn" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub → ${esc(p.repo)}</a></div>
<p class="footer-note reveal">blackcraftlab · ${p.year} · ${esc(p.title)}</p>
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
<p>${items.length} премиальных scroll-кейсов · Awwwards-level · ${new Date().getFullYear()}</p>
</header>
<div class="grid">${items
    .map((p) => {
      const thumb = p.thumb
        ? `<div class="card-thumb"><img src="${esc(p.thumb)}" alt="${esc(p.title)}" width="640" height="400" loading="lazy"/></div>`
        : `<div class="card-thumb card-thumb--empty">${esc(p.title.slice(0, 2))}</div>`;
      return `<a class="card" href="${esc(p.slug)}/index.html" style="--card-accent:${esc(p.accent)}">${thumb}<div class="card-body"><span class="card-type">${esc(p.type)}</span><h2>${esc(p.title)}</h2><p>${esc(p.tagline)}</p><div class="card-meta"><span>${p.hasDemo ? "● LIVE" : "○ CODE"}</span><span>${esc(p.language)}</span></div></div></a>`;
    })
    .join("")}</div>
<footer>Scroll-based case studies · Plus Jakarta Sans + Unbounded</footer>
</div>
</body>
</html>`;
}

// Write shared assets
await mkdir(ASSETS, { recursive: true });
await writeFile(join(ASSETS, "case-study.css"), CASE_STUDY_CSS, "utf8");
await writeFile(join(ASSETS, "case-study.js"), CASE_STUDY_JS, "utf8");

const indexItems = [];
let fileCount = 2;

for (const project of PROJECTS) {
  const dir = join(OUT_ROOT, project.slug);
  await mkdir(dir, { recursive: true });
  const mockups = await findMockups(project.slug, project.mockupDirs);
  const imgs = categorizeMockups(mockups);
  const html = buildCaseStudy(project, imgs);
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
  effects: [
    "gradient mesh background",
    "SVG noise texture",
    "scroll reveal (Intersection Observer)",
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
