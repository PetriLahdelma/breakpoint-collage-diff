# FAQ

**Why not Playwright snapshot tests?**
Snapshot tests are great for components; this tool focuses on full-page breakpoint collages and PR artifacts.

**How do I keep screenshots stable?**
Disable animations, pin fonts, and set locale/timezone. See `docs/stability.md`.

**Where do baselines live?**
Baselines are stored in `baseline/` by default. Update with `--update-baseline`.
