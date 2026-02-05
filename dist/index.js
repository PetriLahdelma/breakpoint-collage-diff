#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { slugifyUrl } from "./lib/slug.js";
const HELP_TEXT = `
breakpoint-collage-diff
Capture breakpoint collages and diff against baselines.

Usage:
  breakpoint-collage-diff --url https://example.com
  breakpoint-collage-diff --urls urls.txt --breakpoints 375,768,1280
  breakpoint-collage-diff --url https://example.com --update-baseline

Options:
  --url <url>               Single URL to capture
  --urls <file>             Text file with URLs (one per line)
  --breakpoints <list>      Comma-separated widths (default: 375,768,1024,1440)
  --outdir <dir>            Output directory (default: artifacts)
  --baseline-dir <dir>      Baseline collage directory (default: baseline)
  --update-baseline         Overwrite baselines with new collages
  --max-diff-pct <n>         Allowed diff ratio (0-1) or percent (0-100)
  --timeout-ms <n>          Page navigation timeout in ms (default: 30000)
  -h, --help                Show help

Exit codes:
  0 success
  1 runtime/config error
  2 diff exceeded max threshold
`.trim();
function printHelp() {
    console.log(HELP_TEXT);
}
function parseArgs(argv) {
    const opts = {
        breakpoints: [375, 768, 1024, 1440],
        outdir: "artifacts",
        baselineDir: "baseline",
        updateBaseline: false,
        maxDiffPct: 0,
        help: false,
        timeoutMs: 30_000
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--help" || a === "-h") {
            opts.help = true;
            continue;
        }
        if (a === "--url") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --url");
            opts.url = value;
            continue;
        }
        if (a === "--urls") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --urls");
            opts.urlsFile = value;
            continue;
        }
        if (a === "--breakpoints") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --breakpoints");
            opts.breakpoints = value
                .split(",")
                .map(n => Number(n.trim()))
                .filter(n => Number.isFinite(n) && n > 0);
            continue;
        }
        if (a === "--outdir") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --outdir");
            opts.outdir = value;
            continue;
        }
        if (a === "--baseline-dir") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --baseline-dir");
            opts.baselineDir = value;
            continue;
        }
        if (a === "--update-baseline") {
            opts.updateBaseline = true;
            continue;
        }
        if (a === "--max-diff-pct") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --max-diff-pct");
            const num = Number(value);
            if (!Number.isFinite(num) || num < 0)
                throw new Error("max-diff-pct must be a number >= 0");
            opts.maxDiffPct = num > 1 ? num / 100 : num;
            if (opts.maxDiffPct > 1)
                throw new Error("max-diff-pct must be <= 100");
            continue;
        }
        if (a === "--timeout-ms") {
            const value = argv[++i];
            if (!value)
                throw new Error("Missing value for --timeout-ms");
            const num = Number(value);
            if (!Number.isFinite(num) || num <= 0)
                throw new Error("timeout-ms must be a number > 0");
            opts.timeoutMs = num;
            continue;
        }
        if (a.startsWith("-")) {
            throw new Error(`Unknown option: ${a}`);
        }
    }
    return opts;
}
function readUrls(opts) {
    if (opts.url && opts.urlsFile) {
        throw new Error("Use --url or --urls, not both");
    }
    if (opts.url)
        return [opts.url];
    if (opts.urlsFile) {
        if (!fs.existsSync(opts.urlsFile)) {
            throw new Error(`URLs file not found: ${opts.urlsFile}`);
        }
        const raw = fs.readFileSync(opts.urlsFile, "utf8");
        return raw
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith("#"));
    }
    return [];
}
async function makeCollage(images, outPath) {
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
function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}
function diffImages(currentPath, baselinePath, diffPath) {
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
    let opts;
    try {
        opts = parseArgs(process.argv.slice(2));
    }
    catch (err) {
        console.error(err instanceof Error ? err.message : err);
        printHelp();
        process.exit(1);
        return;
    }
    if (opts.help) {
        printHelp();
        return;
    }
    if (opts.breakpoints.length === 0) {
        console.error("Provide at least one breakpoint via --breakpoints");
        process.exit(1);
        return;
    }
    let urls;
    try {
        urls = readUrls(opts);
    }
    catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
        return;
    }
    if (urls.length === 0) {
        console.error("Provide --url or --urls <file>");
        process.exit(1);
        return;
    }
    const outCollages = path.join(opts.outdir, "collages");
    const outDiffs = path.join(opts.outdir, "diffs");
    ensureDir(outCollages);
    ensureDir(outDiffs);
    ensureDir(opts.baselineDir);
    const browser = await chromium.launch();
    let failed = false;
    try {
        for (const url of urls) {
            const slug = slugifyUrl(url);
            const shots = [];
            for (const bp of opts.breakpoints) {
                const page = await browser.newPage({ viewport: { width: bp, height: 900 } });
                await page.goto(url, { waitUntil: "networkidle", timeout: opts.timeoutMs });
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
    }
    finally {
        await browser.close();
    }
    if (failed)
        process.exit(2);
}
main().catch(err => {
    console.error(err?.message || err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map