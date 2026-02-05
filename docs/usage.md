# Usage

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
