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

## Quickstart

```bash
npx breakpoint-collage-diff --url https://example.com
```

## Demo

```bash
breakpoint-collage-diff --urls urls.txt --breakpoints 375,768,1280
```

## Why This Exists

Playwright screenshots stitched into a single, reviewable artifact.

## FAQ

- **Does it upload artifacts?** Yes, via GitHub Actions.
- **Can it comment on PRs?** Optional via workflow.

## Contributing

See `CONTRIBUTING.md` for test and render steps.

## License

MIT
