#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { slugifyUrl } from "./lib/slug.js";

type Options = {
  url?: string;
  urlsFile?: string;
  breakpoints: number[];
  outdir: string;
  baselineDir: string;
  updateBaseline: boolean;
  maxDiffPct: number;
};

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    breakpoints: [375, 768, 1024, 1440],
    outdir: "artifacts",
    baselineDir: "baseline",
    updateBaseline: false,
    maxDiffPct: 0
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") opts.url = argv[++i];
    else if (a === "--urls") opts.urlsFile = argv[++i];
    else if (a === "--breakpoints") opts.breakpoints = (argv[++i] || "").split(",").map(n => Number(n.trim())).filter(Boolean);
    else if (a === "--outdir") opts.outdir = argv[++i] || opts.outdir;
    else if (a === "--baseline-dir") opts.baselineDir = argv[++i] || opts.baselineDir;
    else if (a === "--update-baseline") opts.updateBaseline = true;
    else if (a === "--max-diff-pct") opts.maxDiffPct = Number(argv[++i] || 0);
  }
  return opts;
}

function readUrls(opts: Options): string[] {
  if (opts.url) return [opts.url];
  if (opts.urlsFile) {
    const raw = fs.readFileSync(opts.urlsFile, "utf8");
    return raw
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l && !l.startsWith("#"));
  }
  return [];
}

async function makeCollage(images: string[], outPath: string) {
  const metas = await Promise.all(images.map(p => sharp(p).metadata()));
  const width = Math.max(...metas.map(m => m.width || 0));
  const height = metas.reduce((sum, m) => sum + (m.height || 0), 0);

  let top = 0;
  const composites = images.map((img, idx) => {
    const h = metas[idx].height || 0;
    const c = { input: img, top, left: 0 };
    top += h;
    return c;
  });

  await sharp({
    create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
  })
    .composite(composites)
    .png()
    .toFile(outPath);
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function diffImages(currentPath: string, baselinePath: string, diffPath: string) {
  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(currentPath));
  if (img1.width !== img2.width || img1.height !== img2.height) {
    return { diffPct: 1, sizeMismatch: true };
  }
  const diff = new PNG({ width: img1.width, height: img1.height });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const total = img1.width * img1.height;
  return { diffPct: diffPixels / total, sizeMismatch: false };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const urls = readUrls(opts);
  if (urls.length === 0) {
    console.error("Provide --url or --urls <file>");
    process.exit(1);
  }

  const outCollages = path.join(opts.outdir, "collages");
  const outDiffs = path.join(opts.outdir, "diffs");
  ensureDir(outCollages);
  ensureDir(outDiffs);
  ensureDir(opts.baselineDir);

  const browser = await chromium.launch();
  let failed = false;

  for (const url of urls) {
    const slug = slugifyUrl(url);
    const shots: string[] = [];

    for (const bp of opts.breakpoints) {
      const page = await browser.newPage({ viewport: { width: bp, height: 900 } });
      await page.goto(url, { waitUntil: "networkidle" });
      const shotPath = path.join(opts.outdir, `${slug}-${bp}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      await page.close();
      shots.push(shotPath);
    }

    const collagePath = path.join(outCollages, `${slug}.png`);
    await makeCollage(shots, collagePath);
    console.log(`collage written: ${collagePath}`);

    const baselinePath = path.join(opts.baselineDir, `${slug}.png`);
    if (opts.updateBaseline || !fs.existsSync(baselinePath)) {
      fs.copyFileSync(collagePath, baselinePath);
      console.log(`baseline updated: ${baselinePath}`);
      continue;
    }

    const diffPath = path.join(outDiffs, `${slug}.png`);
    const { diffPct, sizeMismatch } = diffImages(collagePath, baselinePath, diffPath);
    console.log(`diff: ${(diffPct * 100).toFixed(2)}%`);
    if (sizeMismatch || diffPct > opts.maxDiffPct) {
      failed = true;
    }
  }

  await browser.close();
  if (failed) process.exit(2);
}

main().catch(err => {
  console.error(err?.message || err);
  process.exit(1);
});
