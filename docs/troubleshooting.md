# Troubleshooting

- **No files matched**: Ensure `--url` or `--urls` is provided.
- **Timeouts**: Increase `--timeout-ms` for slow pages.
- **Playwright missing browsers**: Run `npx playwright install`.
- **Sharp install issues**: Confirm Node 20 and platform build support.
- **Unexpected diffs**: Use `--update-baseline` to refresh baselines.
