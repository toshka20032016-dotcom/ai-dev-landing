/**
 * Capture portfolio mockups: numbered screenshots per project.
 * ponytail: one-off script, not part of build pipeline.
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "C:\\Users\\Alotyn\\Desktop\\мокапы\\portfolio-mockups";

const SECTION_IDS = [
  "services",
  "portfolio",
  "features",
  "about",
  "workflow",
  "program",
  "gallery",
  "pricing",
  "contact",
  "team",
  "cases",
];

/** @type {{ slug: string, title: string, tagline: string, pages: { name: string, url: string }[] }[]} */
const PROJECTS = [
  {
    slug: "blackcraftlab",
    title: "BLACKCRAFTLAB",
    tagline: "AI-Native engineering landing",
    pages: [
      { name: "home", url: "https://blackcraftlab.vercel.app/" },
      { name: "pricing", url: "https://blackcraftlab.vercel.app/pricing" },
    ],
  },
  {
    slug: "ghost-garage",
    title: "GHOST GARAGE CRM",
    tagline: "Auto service CRM",
    pages: [{ name: "home", url: "https://ghost-garage-demo.vercel.app/" }],
  },
  {
    slug: "ghost-arbitrage",
    title: "GHOST ARBITRAGE",
    tagline: "CS2 arbitrage landing",
    pages: [{ name: "home", url: "https://ghost-arbitrage.vercel.app/" }],
  },
  {
    slug: "yandex-pet-day",
    title: "YANDEX PET DAY",
    tagline: "Conference landing",
    pages: [{ name: "home", url: "https://yandex-pet-day-opal.vercel.app/" }],
  },
  {
    slug: "bulochnaya",
    title: "BULOCHNAYA",
    tagline: "Boutique bakery",
    pages: [
      { name: "home", url: "https://bulochnaya-marii-kovrizhkinoy.vercel.app/" },
      { name: "home-alt", url: "https://bulochnaya.vercel.app/" },
    ],
  },
  {
    slug: "villa-poseidon",
    title: "VILLA POSEIDON",
    tagline: "Scrollytelling villa landing",
    pages: [{ name: "home", url: "https://poseidon-villa.vercel.app/" }],
  },
  {
    slug: "usmanova-fit",
    title: "USMANOVA FIT",
    tagline: "Fitness marathon landing",
    pages: [
      { name: "home", url: "https://usmanova-fit.vercel.app/" },
      { name: "home-alt", url: "https://usmanova-fit-landing.vercel.app/" },
    ],
  },
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const SCROLLY_SLUGS = new Set(["villa-poseidon"]);

/** @param {number} n */
function pad(n) {
  return String(n).padStart(2, "0");
}

function parseOnly() {
  const i = process.argv.indexOf("--only");
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  const arg = process.argv.find((a) => a.startsWith("--only="));
  return arg ? arg.slice("--only=".length) : null;
}

async function waitForSettle(page, opts = {}) {
  const deep = Boolean(opts.deep);
  await page.waitForLoadState("networkidle", { timeout: deep ? 45_000 : 30_000 }).catch(() => {});
  await page.waitForTimeout(deep ? 3500 : 2000);
  await page.evaluate(async (isDeep) => {
    const step = Math.max(window.innerHeight * 0.75, 420);
    const max = document.body.scrollHeight;
    const delay = isDeep ? 220 : 100;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, delay));
    }
    if (isDeep) {
      window.scrollTo(0, max);
      await new Promise((r) => setTimeout(r, 900));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  }, deep);
  await page.waitForTimeout(deep ? 1200 : 600);
}

/** @param {import('@playwright/test').Page} page */
async function findSections(page) {
  return page.evaluate((ids) => {
    const found = [];
    for (const id of ids) {
      const el = document.getElementById(id) ?? document.querySelector(`[id="${id}"]`);
      if (el) found.push(id);
    }
    if (found.length >= 2) return found.slice(0, 3);
    const sections = [...document.querySelectorAll("section[id], main section, section")].slice(1, 4);
    for (const s of sections) {
      const id = s.id || s.getAttribute("data-section") || `block-${found.length + 1}`;
      if (!found.includes(id)) found.push(id);
    }
    return found.slice(0, 3);
  }, SECTION_IDS);
}

/** @param {import('@playwright/test').Page} page @param {string} sectionId */
async function scrollToSection(page, sectionId) {
  await page.evaluate((id) => {
    const el =
      document.getElementById(id) ??
      document.querySelector(`[id="${id}"]`) ??
      [...document.querySelectorAll("section")][parseInt(id.replace("block-", ""), 10)];
    if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
    else window.scrollBy(0, window.innerHeight * 0.85);
  }, sectionId);
  await page.waitForTimeout(500);
}

/**
 * @param {import('@playwright/test').Browser} browser
 * @param {string} url
 * @param {{ width: number, height: number }} viewport
 * @param {string} outPath
 * @param {{ fullPage?: boolean }} opts
 */
async function shot(browser, url, viewport, outPath, opts = {}) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const status = res?.status() ?? 0;
  if (status >= 400) {
    await ctx.close();
    return false;
  }
  await waitForSettle(page);
  await page.screenshot({ path: outPath, fullPage: Boolean(opts.fullPage), type: "png" });
  await ctx.close();
  return true;
}

/**
 * @param {import('@playwright/test').Browser} browser
 * @param {string} url
 * @param {string} dir
 * @param {number} startIdx
 */
async function captureHome(browser, url, dir, startIdx, opts = {}) {
  /** @type {string[]} */
  const files = [];
  let idx = startIdx;

  const ctx = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  if ((res?.status() ?? 0) >= 400) {
    await ctx.close();
    return { files, nextIdx: idx, ok: false };
  }
  await waitForSettle(page, { deep: Boolean(opts.deep) });

  if (opts.deep) {
    await page.evaluate(() => {
      const el =
        document.querySelector("[data-hero], #hero, [id*='hero' i], main section, section") ||
        document.querySelector("main > *");
      if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
      else window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1800);
  }

  const hero = join(dir, `${pad(idx)}-hero.png`);
  await page.screenshot({ path: hero, type: "png" });
  files.push(`${pad(idx)}-hero.png`);
  idx++;

  const sections = await findSections(page);
  for (const sec of sections) {
    await scrollToSection(page, sec);
    await page.waitForTimeout(opts.deep ? 900 : 350);
    const name = `${pad(idx)}-section-${sec.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}.png`;
    await page.screenshot({ path: join(dir, name), type: "png" });
    files.push(name);
    idx++;
  }

  const desktopFull = join(dir, `${pad(idx)}-desktop-full.png`);
  await page.screenshot({ path: desktopFull, fullPage: true, type: "png" });
  files.push(`${pad(idx)}-desktop-full.png`);
  idx++;

  await ctx.close();

  const mobileFull = join(dir, `${pad(idx)}-mobile-full.png`);
  const mobOk = await shot(browser, url, MOBILE, mobileFull, { fullPage: true });
  if (mobOk) {
    files.push(`${pad(idx)}-mobile-full.png`);
    idx++;
  }

  return { files, nextIdx: idx, ok: true };
}

/** @param {import('@playwright/test').Browser} browser @param {string} url @param {string} dir @param {number} startIdx */
async function capturePricing(browser, url, dir, startIdx) {
  /** @type {string[]} */
  const files = [];
  let idx = startIdx;
  const desktop = join(dir, `${pad(idx)}-pricing-desktop.png`);
  if (await shot(browser, url, DESKTOP, desktop, { fullPage: true })) {
    files.push(`${pad(idx)}-pricing-desktop.png`);
    idx++;
    const mobile = join(dir, `${pad(idx)}-pricing-mobile.png`);
    if (await shot(browser, url, MOBILE, mobile, { fullPage: true })) {
      files.push(`${pad(idx)}-pricing-mobile.png`);
      idx++;
    }
  }
  return { files, nextIdx: idx };
}

/** @param {import('@playwright/test').Browser} @param {{ pages: { name: string, url: string }[] }} project */
async function resolveHomeUrl(browser, project) {
  for (const pg of project.pages) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      const r = await page.goto(pg.url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      if (r && r.status() < 400) {
        const url = pg.url;
        await ctx.close();
        return { url, name: pg.name };
      }
    } catch {
      /* try next */
    }
    await ctx.close();
  }
  return null;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  /** @type {{ slug: string, title: string, tagline: string, url: string, files: string[], count: number }[]} */
  const captured = [];
  /** @type {{ slug: string, reason: string }[]} */
  const failed = [];

  const only = parseOnly();
  const projects = only ? PROJECTS.filter((p) => p.slug === only) : PROJECTS;
  if (only && !projects.length) {
    console.error(`Unknown --only slug: ${only}`);
    process.exit(1);
  }

  for (const project of projects) {
    console.log(`\n-> ${project.title}`);
    const dir = join(OUT, project.slug);
    await mkdir(dir, { recursive: true });

    const home = await resolveHomeUrl(browser, project);
    if (!home) {
      failed.push({ slug: project.slug, reason: "no live URL" });
      console.log("  SKIP — unavailable");
      continue;
    }

    let idx = 1;
    /** @type {string[]} */
    const allFiles = [];

    const homeCap = await captureHome(browser, home.url, dir, idx, { deep: SCROLLY_SLUGS.has(project.slug) });
    if (!homeCap.ok) {
      failed.push({ slug: project.slug, reason: "home capture failed" });
      continue;
    }
    allFiles.push(...homeCap.files);
    idx = homeCap.nextIdx;

    const pricingPage = project.pages.find((p) => p.name === "pricing" || p.url.includes("/pricing"));
    if (pricingPage && pricingPage.url !== home.url) {
      const pr = await capturePricing(browser, pricingPage.url, dir, idx);
      allFiles.push(...pr.files);
      idx = pr.nextIdx;
    }

    captured.push({
      slug: project.slug,
      title: project.title,
      tagline: project.tagline,
      url: home.url,
      files: allFiles,
      count: allFiles.length,
    });
    console.log(`  OK — ${allFiles.length} screenshots`);
    for (const f of allFiles) console.log(`     ${f}`);
  }

  await browser.close();

  const cards = captured
    .map(
      (p) =>
        `<article class="c"><a href="${p.slug}/" class="t"><img src="${p.slug}/${p.files[0] ?? ""}" alt=""/></a><div class="m"><h2>${p.title}</h2><p>${p.tagline}</p><span>${p.count} shots</span><a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.url}</a></div></article>`,
    )
    .join("");

  const gallery = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/><title>Portfolio Mockups</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#f1f5f9}header{padding:56px 20px;text-align:center}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;max-width:1300px;margin:0 auto;padding:24px}.c{background:#12121a;border-radius:14px;overflow:hidden}.t{display:block;aspect-ratio:16/10;background:#0c0c14}.t img{width:100%;height:100%;object-fit:cover;object-position:top}.m{padding:18px}.m p{color:#94a3b8;margin:8px 0;font-size:13px}.m span{display:block;font-size:11px;color:#22d3ee;margin-bottom:6px}.m a{color:#6366f1;font-size:12px;word-break:break-all}</style></head><body><header><h1>PORTFOLIO MOCKUPS</h1><p>${captured.length} projects · ${captured.reduce((a, p) => a + p.count, 0)} screenshots</p></header><main class="g">${cards}</main></body></html>`;
  await writeFile(join(OUT, "index.html"), gallery, "utf8");

  let readme = `PORTFOLIO MOCKUPS\r\nFolder: ${OUT}\r\nGenerated: ${new Date().toISOString()}\r\n\r\n`;
  for (const p of captured) {
    readme += `${p.title} (${p.slug}/) — ${p.count} files\r\n  URL: ${p.url}\r\n`;
    for (const f of p.files) readme += `    - ${f}\r\n`;
    readme += "\r\n";
  }
  readme += "SKIPPED: CS:GO Sniper Bot (no web UI)\r\n";
  if (failed.length) readme += `\r\nFAILED:\r\n${failed.map((f) => `  ${f.slug}: ${f.reason}`).join("\r\n")}\r\n`;
  await writeFile(join(OUT, "README.txt"), readme, "utf8");

  console.log("\n=== SUMMARY ===");
  for (const p of captured) console.log(`${p.slug}: ${p.count} screenshots`);
  for (const f of failed) console.log(`FAIL ${f.slug}: ${f.reason}`);
  console.log(`Total: ${captured.reduce((a, p) => a + p.count, 0)} screenshots across ${captured.length} projects`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
