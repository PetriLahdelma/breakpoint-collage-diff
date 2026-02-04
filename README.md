# breakpoint-collage-diff

Visual regression as a single collage per page.

Tagline: One collage per URL. No surprises in PRs.

## Quickstart
```bash
npx breakpoint-collage-diff --url https://example.com
```

## Demo
```bash
breakpoint-collage-diff --url https://example.com --breakpoints 375,768,1280
```
Expected output:
```
collage written: artifacts/collages/example-com.png
diff: 0.00%
```

## Screenshots
Placeholder: add screenshots in `docs/` and link them here.

## What it does
- Takes screenshots at multiple breakpoints
- Stitches them into a single collage per URL
- Diffs collages against baselines
- Uploads artifacts in CI and can comment on PRs

## CLI
```bash
breakpoint-collage-diff --url <url> [options]
```
Options:
- `--urls <file>` list of URLs
- `--breakpoints 375,768,1280`
- `--outdir artifacts`
- `--baseline-dir baseline`
- `--update-baseline`
- `--max-diff-pct 0.001`

## GitHub Actions
This repo includes a workflow that uploads collages and diffs as artifacts and can comment on PRs.
Set `COMMENT_ON_PR=true` to enable comments.

## Manual publish steps (optional)
```bash
npm login
npm publish --access public
```
If the name is taken, consider scoped naming like `@petri-lahdelma/breakpoint-collage-diff`.

## License
MIT
