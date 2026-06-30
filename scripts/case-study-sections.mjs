import { PROCESS_BY_SLUG, WEB_VITALS_BY_SLUG } from "./presentation-enrichment.mjs";

const PROCESS_ICONS = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 6l-3 6 3 6M16 6l3 6-3 6M11 4l2 16"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 4l-4 8 4 8M12 4h9M12 12h7M12 20h5"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3l7 4v10l-7 4-7-4V7z"/><path d="M12 9v6"/></svg>`,
];

export function processStepsFor(p) {
  if (p.processSteps?.length) return p.processSteps;
  if (PROCESS_BY_SLUG[p.slug]) return PROCESS_BY_SLUG[p.slug];
  const pool = [...(p.architecture ?? []), ...(p.features ?? []), p.solution];
  return ["Figma-макет", "Логика JavaScript", "Чистый HTML/CSS код", "Готовая интеграция"].map((title, i) => ({
    title,
    description: pool[i] ?? p.solution,
    tooltip: title,
  }));
}

export function webVitalsFor(p) {
  if (p.webVitals) return p.webVitals;
  return WEB_VITALS_BY_SLUG[p.slug] ?? { lcp: "2.2", cls: "0.05", fid: "35" };
}

export function techTip(p, tech) {
  return p.techTooltips?.[tech] ?? p.comparisonTooltips?.[0] ?? tech;
}

export function ctaUrlFor(p) {
  return p.ctaUrl ?? (p.slug === "blackcraftlab" ? "https://blackcraftlab.vercel.app/#contact" : "https://t.me/Zavod_Worker");
}

export function buildProcessSection(p, imgs, esc) {
  const steps = processStepsFor(p);
  const thumbs = [imgs.hero, ...imgs.sections, ...imgs.gallery].filter(Boolean);
  const stepsHtml = steps
    .map((step, i) => {
      const thumb = thumbs[i];
      const thumbHtml = thumb
        ? `<img class="process-thumb lightbox-trigger" src="${esc(thumb.src)}" alt="" width="120" height="80" loading="lazy"/>`
        : `<div class="process-thumb process-thumb--placeholder" aria-hidden="true"></div>`;
      return `<li class="process-step reveal tilt-card" data-tooltip="${esc(step.tooltip ?? step.title)}"><div class="process-icon">${PROCESS_ICONS[i] ?? PROCESS_ICONS[0]}</div>${thumbHtml}<h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></li>`;
    })
    .join("");
  return `<section class="section process-section" id="process"><div class="section-inner"><div class="reveal"><p class="eyebrow">Процесс</p><h2 class="section-title">Погружение в процесс</h2><p class="lead">Figma-макет → Логика JavaScript → Чистый HTML/CSS код → Готовая интеграция.</p></div><ol class="process-timeline stagger-parent"><span class="process-connector" aria-hidden="true"></span>${stepsHtml}</ol></div></section>`;
}

export function buildEliteCta(p, live, esc) {
  const url = ctaUrlFor(p);
  const links = `${live ? `<a class="link-btn" href="${esc(p.demoUrl)}" target="_blank" rel="noopener noreferrer">Демо</a>` : ""}<a class="link-btn" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
  return `<section class="section elite-cta" id="elite-cta"><div class="elite-cta__inner reveal tilt-card"><h2 class="elite-cta__title">БЫСТРО. ПРОСТО. СО ВКУСОМ. ЗАКАЖИТЕ СЕЙЧАС.</h2><a class="elite-cta__btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">ОБСУДИТЬ ПРОЕКТ</a><p class="elite-cta__sub">${links}</p><p class="footer-note">blackcraftlab · ${p.year} · ${esc(p.title)}</p></div></section>`;
}

export function vitalBarsHtml(p, esc) {
  const vitals = webVitalsFor(p);
  const footnote = p.pageSpeedFootnote ?? "оптимизация в процессе";
  const vitalBar = (label, value, unit, max) => {
    const pct = Math.min(100, Math.round((Number(value) / max) * 100));
    return `<div class="vital-row reveal" data-tooltip="${esc(label + " — Core Web Vital")}" style="--vital-pct:${100 - pct}%"><span>${label}</span><div class="vital-bar"><i></i></div><strong>${esc(String(value))}${unit}</strong></div>`;
  };
  return `<div class="vitals reveal"><p class="eyebrow" style="margin-bottom:8px">Core Web Vitals</p>${vitalBar("LCP", vitals.lcp, "s", 4)}${vitalBar("CLS", vitals.cls, "", 0.25)}${vitalBar("FID", vitals.fid, "ms", 100)}<p class="perf-footnote">${esc(footnote)}</p></div>`;
}