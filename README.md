# breakpoint-collage-diff
Collage all breakpoints and catch visual regressions fast.

- Captures breakpoint screenshots with Playwright and stitches a single collage.
- Diffs collages against baselines to spot visual regressions.
- Works with GitHub Actions for artifacts and optional PR comments.

**Try in 10 seconds**
```bash
npx breakpoint-collage-diff --url https://example.com
```

**Demo**
Record a run that shows the collage image and a diff result.

**Trust & safety**
This tool loads URLs in a headless browser. Run it against URLs you trust.

Star if this saves you time.  
→ Buzz Kit: /buzz-kit

![CI](https://github.com/PetriLahdelma/breakpoint-collage-diff/actions/workflows/ci.yml/badge.svg) ![Release](https://img.shields.io/github/v/release/PetriLahdelma/breakpoint-collage-diff) ![License](https://img.shields.io/github/license/PetriLahdelma/breakpoint-collage-diff) ![Stars](https://img.shields.io/github/stars/PetriLahdelma/breakpoint-collage-diff)

![Hero](assets/hero.png?20260205)

## Requirements

- Node.js 20+
- Playwright browsers installed (`npx playwright install`)
- Image processing uses `sharp` (prebuilt binaries for Node 20)

## Quickstart

```bash
npx breakpoint-collage-diff --url https://example.com
```

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

## Demo

```bash
breakpoint-collage-diff --urls urls.txt --breakpoints 375,768,1280
```

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

## Contributing

See `CONTRIBUTING.md` for test and render steps.

## License

MIT
