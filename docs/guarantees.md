# Guarantees & Non-Goals

**Guarantees**
- Uses Playwright for deterministic viewport capture.
- Diffs are computed with pixelmatch and explicit thresholds.
- Baselines are stored locally in your repo.

**Non-Goals**
- Not a hosted visual regression service.
- Not a replacement for full snapshot testing.
- Pixel-perfect parity across OS/font stacks is not guaranteed.
