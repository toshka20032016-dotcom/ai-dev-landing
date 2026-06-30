import { mkdir, writeFile, readdir } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOCKUPS_ROOT = "C:\\Users\\Alotyn\\Desktop\\мокапы";
const OUT_ROOT = join(MOCKUPS_ROOT, "презентации");
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

/** @param {import('./presentation-data.mjs').Project} p @param {{ name: string, src: string }[]} mockups */
function pickMockups(mockups) {
  const hero = mockups.find((m) => /hero|01-/.test(m.name)) ?? mockups[0];
  const desktop =
    mockups.find((m) => /desktop-full|desktop-mockup|desktop\.png/.test(m.name)) ??
    mockups.find((m) => /desktop/.test(m.name));
  const mobile =
    mockups.find((m) => /mobile-full|mobile-mockup|mobile\.png/.test(m.name)) ??
    mockups.find((m) => /mobile/.test(m.name));
  const gallery = mockups.filter((m) => m !== hero).slice(0, 6);
  if (gallery.length < 4) {
    for (const m of mockups) {
      if (gallery.length >= 6) break;
      if (!gallery.includes(m)) gallery.push(m);
    }
  }
  return { hero, desktop, mobile, gallery: gallery.slice(0, 6) };
}

/** @param {import('./presentation-data.mjs').Project} p */
function cssVars(p) {
  const a = p.accent ?? "#22d3ee";
  const b = p.accentSecondary ?? "#a78bfa";
  return `:root{--bg:#050508;--text:#f1f5f9;--muted:#94a3b8;--accent:${a};--accent2:${b};--border:rgba(148,163,184,.14);--glass:rgba(12,12,20,.72)}`;
}

const BASE_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--text);font-family:"Segoe UI",system-ui,sans-serif}.mesh{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 15% 0%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 55%),radial-gradient(ellipse 60% 45% at 85% 100%,color-mix(in srgb,var(--accent2) 12%,transparent),transparent 50%),var(--bg)}.particles{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}.particle{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:.25;animation:float linear infinite}@keyframes float{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.35}90%{opacity:.15}100%{transform:translateY(-110vh) translateX(20px);opacity:0}}.deck{height:100vh;position:relative;z-index:1}.slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:48px 64px 100px;opacity:0;pointer-events:none;transform:translateY(18px) scale(.985);transition:opacity .5s ease,transform .5s ease}.slide.is-active{opacity:1;pointer-events:auto;transform:none;z-index:2}.slide.is-exiting{opacity:0;transform:translateY(-12px) scale(.99)}.slide-scroll{max-height:calc(100vh - 140px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--accent) 40%,transparent) transparent}.slide-inner{max-width:1120px;width:100%}.slide-inner--center{text-align:center;margin-inline:auto}.eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;font-weight:600}.gradient-title{font-size:clamp(2.4rem,5vw,4.2rem);font-weight:800;letter-spacing:-.03em;line-height:1.05;background:linear-gradient(135deg,#fff 20%,var(--accent) 55%,var(--accent2));background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 6s ease infinite}@keyframes shimmer{0%,100%{background-position:0% center}50%{background-position:100% center}}h2{font-size:clamp(1.65rem,3vw,2.4rem);font-weight:700;margin-bottom:20px}h3{font-size:.85rem;color:var(--accent);margin-bottom:8px;text-transform:uppercase;letter-spacing:.1em}.tagline{font-size:1.2rem;color:var(--muted);margin-top:14px;max-width:640px;margin-inline:auto}.lead{font-size:1.05rem;line-height:1.75;color:#cbd5e1;max-width:820px}.logo-mark{width:72px;height:72px;margin:0 auto 20px;border-radius:20px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 18%,transparent),color-mix(in srgb,var(--accent2) 10%,transparent));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.4rem;color:var(--accent);box-shadow:0 0 40px color-mix(in srgb,var(--accent) 25%,transparent)}.title-meta{display:flex;gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap}.pill{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.03)}.pill--live{border-color:color-mix(in srgb,var(--accent) 45%,transparent);color:var(--accent)}.pill--code{border-color:color-mix(in srgb,var(--accent2) 45%,transparent);color:var(--accent2)}.info-card,.ps-card{padding:22px 24px;border-radius:16px;border:1px solid var(--border);background:var(--glass);backdrop-filter:blur(12px);line-height:1.65}.ps-card--problem{border-color:color-mix(in srgb,#f472b6 25%,transparent)}.ps-card--solution{border-color:color-mix(in srgb,var(--accent) 30%,transparent)}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}.info-card span{display:block;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:6px}.tech-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:8px}.tech-pill{padding:14px 16px;border-radius:14px;font-weight:600;font-size:.88rem;text-align:center;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 12%,transparent),color-mix(in srgb,var(--accent2) 8%,transparent));border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);opacity:0;transform:translateY(10px);transition:opacity .4s ease,transform .4s ease}.slide.is-active .tech-pill.reveal{opacity:1;transform:none}.feature-list{list-style:none;display:grid;gap:10px}.feature-list li{padding:14px 18px 14px 42px;border-radius:12px;border:1px solid var(--border);background:var(--glass);position:relative;line-height:1.5;opacity:0;transform:translateX(-8px);transition:opacity .45s ease,transform .45s ease}.feature-list li::before{content:"";position:absolute;left:16px;top:50%;transform:translateY(-50%);width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent)}.slide.is-active .feature-list li.reveal{opacity:1;transform:none}.masonry{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:120px;gap:10px;margin-top:8px}.masonry-item{border-radius:12px;overflow:hidden;border:1px solid var(--border);position:relative;background:#0c0c14}.masonry-item:nth-child(1){grid-row:span 2;grid-column:span 2}.masonry-item img{width:100%;height:100%;object-fit:cover;object-position:top;display:block;transition:transform .45s ease}.masonry-item:hover img{transform:scale(1.06)}.masonry-item figcaption{position:absolute;bottom:0;left:0;right:0;padding:6px 10px;font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;color:#e2e8f0;background:linear-gradient(transparent,rgba(0,0,0,.75))}.device-showcase{display:flex;align-items:center;justify-content:center;padding:12px 0}.browser-frame{width:min(920px,100%);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 60px color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid var(--border);background:#111}.browser-chrome{height:38px;background:linear-gradient(180deg,#2a2a2e,#1e1e22);display:flex;align-items:center;padding:0 14px;gap:7px;border-bottom:1px solid rgba(255,255,255,.06)}.dot{width:11px;height:11px;border-radius:50%}.dot-r{background:#ff5f57}.dot-y{background:#febc2e}.dot-g{background:#28c840}.url-bar{flex:1;margin-left:10px;height:22px;border-radius:6px;background:rgba(0,0,0,.35);font-size:10px;color:rgba(255,255,255,.35);display:flex;align-items:center;padding:0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.browser-frame img,.phone-frame img{width:100%;display:block;object-fit:cover;object-position:top}.phone-frame{width:min(280px,72vw);border-radius:40px;padding:10px;background:linear-gradient(145deg,#3a3a3f,#0d0d10);box-shadow:0 25px 70px rgba(0,0,0,.6),0 0 50px color-mix(in srgb,var(--accent) 15%,transparent);border:1px solid rgba(255,255,255,.1);position:relative}.phone-notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:90px;height:24px;background:#0d0d10;border-radius:0 0 14px 14px;z-index:2}.phone-screen{border-radius:30px;overflow:hidden;max-height:520px;background:#000}.phone-bar{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:rgba(255,255,255,.35);border-radius:2px}.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.metric-card{padding:20px;border-radius:16px;border:1px solid var(--border);background:linear-gradient(160deg,color-mix(in srgb,var(--accent) 8%,transparent),color-mix(in srgb,var(--accent2) 5%,transparent));backdrop-filter:blur(10px);opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s ease}.slide.is-active .metric-card.reveal{opacity:1;transform:none}.metric-value{font-size:1.55rem;font-weight:800;color:var(--accent)}.metric-label{font-size:.82rem;font-weight:600;margin-top:4px}.metric-desc{font-size:.75rem;color:var(--muted);margin-top:6px;line-height:1.4}.arch-flow{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.arch-step{flex:1 1 180px;padding:16px 18px;border-radius:14px;border:1px solid var(--border);background:var(--glass);position:relative;opacity:0;transform:translateY(8px);transition:opacity .4s ease,transform .4s ease}.slide.is-active .arch-step.reveal{opacity:1;transform:none}.arch-step::before{content:attr(data-step);display:block;font-size:.65rem;color:var(--accent);letter-spacing:.12em;margin-bottom:6px}.link-stack{display:flex;flex-direction:column;gap:12px;align-items:center;margin:22px 0}.link-btn{display:inline-flex;padding:13px 30px;border-radius:12px;text-decoration:none;font-weight:600;border:1px solid var(--border);color:var(--text);transition:transform .2s,border-color .2s}.link-btn:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 45%,transparent)}.link-btn--primary{background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 28%,transparent),color-mix(in srgb,var(--accent2) 18%,transparent));border-color:color-mix(in srgb,var(--accent) 40%,transparent)}.footer-note{margin-top:20px;font-size:.78rem;color:var(--muted)}.placeholder-visual{min-height:280px;border-radius:16px;border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;text-align:center;padding:32px;color:var(--muted);background:var(--glass)}.placeholder-visual a{color:var(--accent)}.muted{color:var(--muted)}.nav{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:20;display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:999px;background:rgba(8,8,12,.88);border:1px solid var(--border);backdrop-filter:blur(10px)}.nav button{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:1rem;transition:border-color .2s,background .2s}.nav button:hover{border-color:color-mix(in srgb,var(--accent) 50%,transparent);background:color-mix(in srgb,var(--accent) 8%,transparent)}.dots{display:flex;gap:5px;max-width:200px;overflow-x:auto}.dots button{width:7px;height:7px;min-width:7px;padding:0;border-radius:50%;border:none;background:rgba(148,163,184,.28);cursor:pointer;transition:transform .2s,background .2s}.dots button.is-active{background:var(--accent);transform:scale(1.35)}.counter{font-size:.72rem;color:var(--muted);min-width:52px;text-align:center;font-variant-numeric:tabular-nums}.progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));z-index:30;transition:width .4s ease}@media(max-width:768px){.slide{padding:24px 16px 96px}.two-col,.masonry{grid-template-columns:1fr}.masonry{grid-auto-rows:140px}.masonry-item:nth-child(1){grid-row:span 1;grid-column:span 1}.tech-grid{grid-template-columns:repeat(2,1fr)}}@media(prefers-reduced-motion:reduce){.gradient-title,.particle{animation:none!important}.slide,.tech-pill,.feature-list li,.metric-card,.arch-step{transition:none!important;transform:none!important;opacity:1!important}.masonry-item img{transition:none}}@media print{.nav,.progress,.particles,.mesh{display:none}.slide{position:relative;opacity:1!important;transform:none!important;page-break-after:always;min-height:100vh;pointer-events:auto}html,body{overflow:visible;height:auto}}`;

/** @param {import('./presentation-data.mjs').Project} p @param {{ hero?: { src: string, name: string }, desktop?: { src: string, name: string }, mobile?: { src: string, name: string }, gallery: { src: string, name: string }[] }} imgs */
function buildPresentation(p, imgs) {
  const live = Boolean(p.demoUrl && !p.demoUrl.includes("github.com"));
  const initials = p.title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const host = live ? new URL(p.demoUrl).hostname : p.repo + ".vercel.app";

  const gallerySlide =
    imgs.gallery.length > 0
      ? `<section class="slide" data-slide><div class="slide-inner slide-scroll"><p class="eyebrow">Визуал</p><h2>Галерея скриншотов</h2><div class="masonry">${imgs.gallery
          .map(
            (m) =>
              `<figure class="masonry-item"><img src="${esc(m.src)}" alt="${esc(m.name)}" loading="lazy"/><figcaption>${esc(m.name.replace(/\.(png|jpg|webp)$/i, ""))}</figcaption></figure>`,
          )
          .join("")}</div></div></section>`
      : `<section class="slide" data-slide><div class="slide-inner"><p class="eyebrow">Визуал</p><h2>Галерея скриншотов</h2><div class="placeholder-visual"><p>Мокапы появятся после capture-скрипта.${live ? `<br/><a href="${esc(p.demoUrl)}" target="_blank" rel="noopener noreferrer">Открыть демо 胢↙</a>` : ""}</p></div></div></section>`;

  const desktopSlide = imgs.desktop
    ? `<section class="slide" data-slide><div class="slide-inner"><p class="eyebrow">Desktop</p><h2>Витрина — десктоп</h2><div class="device-showcase"><div class="browser-frame"><div class="browser-chrome"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span><div class="url-bar">${esc(host)}</div></div><img src="${esc(imgs.desktop.src)}" alt="Desktop" loading="lazy"/></div></div></div></section>`
    : "";

  const mobileSlide = imgs.mobile
    ? `<section class="slide" data-slide><div class="slide-inner slide-inner--center"><p class="eyebrow">Mobile</p><h2>Витрина — мобильная версия</h2><div class="device-showcase"><div class="phone-frame"><div class="phone-notch"></div><div class="phone-screen"><img src="${esc(imgs.mobile.src)}" alt="Mobile" loading="lazy"/></div><div class="phone-bar"></div></div></div></div></section>`
    : "";

  const archSlide =
    p.architecture && p.architecture.length > 0
      ? `<section class="slide" data-slide><div class="slide-inner slide-scroll"><p class="eyebrow">Процесс</p><h2>Архитектура и workflow</h2><div class="arch-flow">${p.architecture
          .map(
            (step, i) =>
              `<div class="arch-step" data-step="Шаг ${i + 1}">${esc(step)}</div>`,
          )
          .join("")}</div></div></section>`
      : "";


  const slides = [
    slideTitle(p, initials, live),
    slideOverview(p),
    slideProblem(p),
    slideSolution(p),
    slideTech(p),
    slideFeatures(p),
    gallerySlide,
    desktopSlide,
    mobileSlide,
    slideMetrics(p),
    archSlide,
    slideCta(p, live),
  ].filter(Boolean);

  const particles = Array.from({ length: 18 }, (_, i) => {
    const left = (i * 17 + 7) % 100;
    const delay = (i * 0.7) % 8;
    const dur = 12 + (i % 6);
    return '<span class="particle" style="left:' + left + '%;bottom:-5%;animation-duration:' + dur + 's;animation-delay:' + delay + 's"></span>';
  }).join("");

  const js = "(function(){const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const slides=[...document.querySelectorAll('[data-slide]')],dotsEl=document.getElementById('dots'),pr=document.getElementById('progress'),ctr=document.getElementById('counter');let i=0;slides.forEach((_,n)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(n+1));b.onclick=()=>go(n);dotsEl.appendChild(b)});function staggerSlide(el){if(reduced)return;const kind=el.dataset.stagger;if(kind==='tech')el.querySelectorAll('.tech-pill').forEach((n,x)=>{n.classList.add('reveal');n.style.transitionDelay=(x*60)+'ms'});if(kind==='features')el.querySelectorAll('.feature-list li').forEach((n,x)=>{n.classList.add('reveal');n.style.transitionDelay=(x*80)+'ms'});if(kind==='metrics')el.querySelectorAll('.metric-card').forEach((n,x)=>{n.classList.add('reveal');n.style.transitionDelay=(x*90)+'ms'});el.querySelectorAll('.arch-step').forEach((n,x)=>{n.classList.add('reveal');n.style.transitionDelay=(x*100)+'ms'})}function go(n){if(n<0||n>=slides.length||n===i)return;const prev=slides[i];prev.classList.remove('is-active');prev.classList.add('is-exiting');i=n;setTimeout(()=>prev.classList.remove('is-exiting'),400);slides.forEach((el,x)=>el.classList.toggle('is-active',x===i));[...dotsEl.children].forEach((el,x)=>el.classList.toggle('is-active',x===i));pr.style.width=((i+1)/slides.length*100)+'%';ctr.textContent=(i+1)+' / '+slides.length;staggerSlide(slides[i])}document.getElementById('prev').onclick=()=>go(i-1);document.getElementById('next').onclick=()=>go(i+1);window.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')go(i+1);if(e.key==='ArrowLeft')go(i-1);if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1)});let tx=0;document.addEventListener('touchstart',e=>{tx=e.changedTouches[0].screenX},{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-tx;if(Math.abs(dx)>50)go(dx<0?i+1:i-1)},{passive:true});go(0)})();";

  return '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>' + esc(p.title) + ' \u2014 \u041f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f</title><style>' + cssVars(p) + BASE_CSS + '</style></head><body><div class="mesh"></div><div class="particles">' + particles + '</div><div class="progress" id="progress"></div><main class="deck" id="deck">' + slides.join("") + '</main><nav class="nav" aria-label="Nav"><button type="button" id="prev" aria-label="Previous">&larr;</button><span class="counter" id="counter">1 / ' + slides.length + '</span><div class="dots" id="dots"></div><button type="button" id="next" aria-label="Next">&rarr;</button></nav><script>' + js + "</script></body></html>";
}


function slideTitle(p, initials, live) {
  return '<section class="slide" data-slide><div class="slide-inner slide-inner--center"><div class="logo-mark">' + esc(initials) + '</div><p class="eyebrow">' + esc(p.type) + ' \u00b7 ' + p.year + '</p><h1 class="gradient-title">' + esc(p.title) + '</h1><p class="tagline">' + esc(p.tagline) + '</p><div class="title-meta"><span class="pill">' + esc(p.language) + '</span><span class="pill ' + (live ? "pill--live" : "pill--code") + '">' + (live ? "\u25cf LIVE" : "\u25cb CODE") + '</span></div></div></section>';
}
function slideOverview(p) {
  return '<section class="slide" data-slide><div class="slide-inner slide-scroll"><p class="eyebrow">\u041e\u0431\u0437\u043e\u0440</p><h2>\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435</h2><p class="lead">' + esc(p.overview) + '</p><div class="two-col"><div class="info-card"><span>\u0422\u0438\u043f</span><strong>' + esc(p.type) + '</strong></div><div class="info-card"><span>\u0420\u0435\u043f\u043e\u0437\u0438\u0442\u043e\u0440\u0438\u0439</span><strong>' + esc(p.repo) + '</strong></div></div></div></section>';
}
function slideProblem(p) {
  return '<section class="slide" data-slide><div class="slide-inner"><p class="eyebrow">\u0417\u0430\u0434\u0430\u0447\u0430</p><h2>\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u0430</h2><div class="ps-card ps-card--problem"><p>' + esc(p.problem) + '</p></div></div></section>';
}
function slideSolution(p) {
  return '<section class="slide" data-slide><div class="slide-inner"><p class="eyebrow">\u041f\u043e\u0434\u0445\u043e\u0434</p><h2>\u0420\u0435\u0448\u0435\u043d\u0438\u0435</h2><div class="ps-card ps-card--solution"><p>' + esc(p.solution) + '</p></div></div></section>';
}
function slideTech(p) {
  return '<section class="slide" data-slide data-stagger="tech"><div class="slide-inner slide-scroll"><p class="eyebrow">\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438</p><h2>\u0421\u0442\u0435\u043a</h2><div class="tech-grid">' + p.techs.map((t) => '<span class="tech-pill">' + esc(t) + "</span>").join("") + '</div><p class="muted" style="margin-top:16px">\u042f\u0437\u044b\u043a: <strong>' + esc(p.language) + "</strong></p></div></section>";
}
function slideFeatures(p) {
  return '<section class="slide" data-slide data-stagger="features"><div class="slide-inner slide-scroll"><p class="eyebrow">\u0424\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b</p><h2>\u041a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438</h2><ul class="feature-list">' + p.features.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul></div></section>";
}
function slideMetrics(p) {
  return '<section class="slide" data-slide data-stagger="metrics"><div class="slide-inner"><p class="eyebrow">\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b</p><h2>\u041c\u0435\u0442\u0440\u0438\u043a\u0438</h2><div class="metrics-grid">' + p.metrics.map((m) => '<div class="metric-card"><div class="metric-value">' + esc(m.value) + '</div><div class="metric-label">' + esc(m.label) + "</div>" + (m.desc ? '<p class="metric-desc">' + esc(m.desc) + "</p>" : "") + "</div>").join("") + "</div></div></section>";
}
function slideCta(p, live) {
  return '<section class="slide" data-slide><div class="slide-inner slide-inner--center"><p class="eyebrow">\u0421\u0441\u044b\u043b\u043a\u0438</p><h2>\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u0434\u0435\u043c\u043e</h2><div class="link-stack">' + (live ? '<a class="link-btn link-btn--primary" href="' + esc(p.demoUrl) + '" target="_blank" rel="noopener noreferrer">\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0434\u0435\u043c\u043e</a>' : "") + '<a class="link-btn" href="' + esc(p.githubUrl) + '" target="_blank" rel="noopener noreferrer">GitHub \u2192 ' + esc(p.repo) + '</a></div><p class="footer-note">blackcraftlab \u00b7 ' + p.year + " \u00b7 " + esc(p.title) + "</p></div></section>";
}

/** @param {{ slug: string, title: string, tagline: string, type: string, language: string, hasDemo: boolean, thumb?: string, accent: string }[]} items */
function buildIndex(items) {
  return '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e \u2014 \u041f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u0438</title><style>:root{--bg:#050508;--text:#f1f5f9;--muted:#94a3b8;--cyan:#22d3ee;--border:rgba(148,163,184,.12)}*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Segoe UI",system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(34,211,238,.1),transparent),radial-gradient(ellipse 60% 40% at 100% 100%,rgba(167,139,250,.08),transparent)}.wrap{max-width:1240px;margin:0 auto;padding:48px 20px 72px}header{text-align:center;margin-bottom:36px}header h1{font-size:clamp(2rem,4vw,3rem);font-weight:800;background:linear-gradient(135deg,#fff,var(--cyan),#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}header p{color:var(--muted);margin-top:10px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.card{display:block;border-radius:18px;text-decoration:none;color:inherit;border:1px solid var(--border);background:rgba(12,12,20,.75);overflow:hidden;transition:transform .22s,border-color .22s,box-shadow .22s}.card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--card-accent,#22d3ee) 40%,transparent);box-shadow:0 12px 40px color-mix(in srgb,var(--card-accent,#22d3ee) 12%,transparent)}.card-thumb{aspect-ratio:16/10;background:#0c0c14;overflow:hidden}.card-thumb img{width:100%;height:100%;object-fit:cover;object-position:top;display:block;transition:transform .35s ease}.card:hover .card-thumb img{transform:scale(1.04)}.card-thumb--empty{display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:var(--card-accent,#22d3ee);opacity:.5}.card-body{padding:18px 20px 20px}.card-type{font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:var(--card-accent,#22d3ee)}.card h2{font-size:1.15rem;margin:6px 0 8px}.card p{color:var(--muted);font-size:.86rem;line-height:1.45}.card-meta{display:flex;gap:12px;margin-top:10px;font-size:.7rem;color:var(--muted)}footer{text-align:center;margin-top:36px;color:var(--muted);font-size:.8rem}</style></head><body><div class="wrap"><header><h1>\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e \u00b7 \u041f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u0438</h1><p>' + items.length + " \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432 \u00b7 premium slide decks \u00b7 " + new Date().getFullYear() + '</p></header><div class="grid">' + items.map((p) => {
    const thumb = p.thumb ? '<div class="card-thumb"><img src="' + esc(p.thumb) + '" alt="' + esc(p.title) + '" loading="lazy"/></div>' : '<div class="card-thumb card-thumb--empty">' + esc(p.title.slice(0, 2)) + "</div>";
    return '<a class="card" href="' + esc(p.slug) + '/presentation.html" style="--card-accent:' + esc(p.accent) + '">' + thumb + '<div class="card-body"><span class="card-type">' + esc(p.type) + "</span><h2>" + esc(p.title) + "</h2><p>" + esc(p.tagline) + '</p><div class="card-meta"><span>' + (p.hasDemo ? "\u25cf LIVE" : "\u25cb CODE") + "</span><span>" + esc(p.language) + "</span></div></div></a>";
  }).join("") + '</div><footer>\u2190 \u2192 \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f \u00b7 Ctrl+P \u0434\u043b\u044f PDF</footer></div></body></html>';
}

const indexItems = [];
let fileCount = 0;

for (const project of PROJECTS) {
  const dir = join(OUT_ROOT, project.slug);
  await mkdir(dir, { recursive: true });
  const mockups = await findMockups(project.slug, project.mockupDirs);
  const imgs = pickMockups(mockups);
  await writeFile(join(dir, "presentation.html"), buildPresentation(project, imgs), "utf8");
  fileCount++;
  const thumbFile = imgs.hero?.name ?? imgs.gallery[0]?.name;
  const thumb = thumbFile ? "../portfolio-mockups/" + project.slug + "/" + thumbFile : undefined;
  indexItems.push({ slug: project.slug, title: project.title, tagline: project.tagline, type: project.type, language: project.language, hasDemo: Boolean(project.demoUrl && !project.demoUrl.includes("github.com")), thumb, accent: project.accent ?? "#22d3ee" });
  console.log("ok " + project.slug + " (" + mockups.length + " mockups)");
}

await writeFile(join(OUT_ROOT, "index.html"), buildIndex(indexItems), "utf8");
fileCount++;
const manifest = { generatedAt: new Date().toISOString(), outputDir: OUT_ROOT, slideCount: 12, effects: ["gradient mesh", "particles", "fade+scale transitions", "progress bar", "keyboard+touch nav", "staggered reveal", "masonry gallery", "device frames", "glassmorphism", "prefers-reduced-motion"], projects: PROJECTS.map((p) => ({ slug: p.slug, accent: p.accent, repo: p.repo, demoUrl: p.demoUrl, githubUrl: p.githubUrl, live: Boolean(p.demoUrl && !p.demoUrl.includes("github.com")) })), fileCount };
await writeFile(join(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
fileCount++;
console.log("Done: " + fileCount + " files -> " + OUT_ROOT);
