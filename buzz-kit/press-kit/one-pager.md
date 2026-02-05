**Overview**
breakpoint-collage-diff collages breakpoint screenshots and diffs them against baselines.

**Problem**
Reviewing responsive UI changes across many breakpoints is slow and noisy.

**What It Does**
- Captures breakpoints with Playwright.
- Stitches a single collage image.
- Diffs against baselines for regression checks.

**Quickstart**
```bash
npx breakpoint-collage-diff --url https://example.com
```

**Who It Is For**
Frontend teams that need fast visual regression checks for responsive UIs.

**Trust & Safety**
Loads target URLs in a headless browser. Run against URLs you trust.

**Repo**
PetriLahdelma/breakpoint-collage-diff
