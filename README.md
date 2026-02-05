<picture>
  <source srcset="branding/hero.svg" type="image/svg+xml">
  <img alt="breakpoint-collage-diff hero" src="branding/hero.png" width="100%">
</picture>

# breakpoint-collage-diff
Collage all breakpoints and catch visual regressions fast. Stitch breakpoints and diff baselines in CI.

![CI](https://github.com/PetriLahdelma/breakpoint-collage-diff/actions/workflows/ci.yml/badge.svg) ![Release](https://img.shields.io/github/v/release/PetriLahdelma/breakpoint-collage-diff) ![License](https://img.shields.io/github/license/PetriLahdelma/breakpoint-collage-diff) ![Stars](https://img.shields.io/github/stars/PetriLahdelma/breakpoint-collage-diff)

> [!IMPORTANT]
> This tool loads URLs in headless Chromium. Run it only against pages you trust.

## Quickstart
```bash
npx breakpoint-collage-diff --url https://example.com
```

## Demo
![Terminal Demo](branding/screenshots/terminal-demo.svg)

```bash
breakpoint-collage-diff --urls urls.txt --breakpoints 375,768,1280
```

## Docs
Start here: [Requirements](#requirements) · [Usage](#usage) · [Output](#output) · [Exit Codes](#exit-codes) · [Troubleshooting](#troubleshooting)

## Contributing
See `CONTRIBUTING.md`.

## Requirements

- Node.js 20+
- Playwright browsers installed (`npx playwright install`)
- Image processing uses `sharp` (prebuilt binaries for Node 20)

## Usage

```bash
breakpoint-collage-diff --url https://example.com
breakpoint-collage-diff --urls urls.txt --breakpoints 375,768,1280
breakpoint-collage-diff --url https://example.com --update-baseline
```

**Options**

- `--url <url>` Single URL to capture
- `--urls <file>` Text file with URLs (one per line)
- `--breakpoints <list>` Comma-separated widths (default `375,768,1024,1440`)
- `--outdir <dir>` Output directory (default `artifacts`)
- `--baseline-dir <dir>` Baseline collage directory (default `baseline`)
- `--update-baseline` Overwrite baselines with new collages
- `--max-diff-pct <n>` Allowed diff ratio (0–1) or percent (0–100)
- `--timeout-ms <n>` Navigation timeout in ms (default `30000`)

## Why This Exists

Playwright screenshots stitched into a single, reviewable artifact.

## Output

- Collages: `artifacts/collages/<slug>.png`
- Diffs: `artifacts/diffs/<slug>.png`
- Baselines: `baseline/<slug>.png`

## Exit Codes

- `0` Success
- `1` Runtime/config error
- `2` Diff exceeded `--max-diff-pct`

## Troubleshooting

- **No files matched**: Ensure `--url` or `--urls` is provided.
- **Timeouts**: Increase `--timeout-ms` for slow pages.
- **Playwright missing browsers**: Run `npx playwright install`.
- **Sharp install issues**: Confirm Node 20 and platform build support.
- **Unexpected diffs**: Use `--update-baseline` to refresh baselines.

## FAQ

- **Does it upload artifacts?** Yes, via GitHub Actions.
- **Can it comment on PRs?** Optional via workflow.

## License

MIT

