export default {
  name: "breakpoint-collage-diff",
  tagline: "Collage all breakpoints and catch visual regressions fast.",
  value: "Stitch breakpoints and diff baselines in CI.",
  accent: "#6366F1",
  pills: ["Playwright capture","Collage diff","PR artifacts"],
  demo: ["$ breakpoint-collage-diff --url https://example.com","Captured 4 breakpoints","Collage: artifacts/collages/example.png","Diff: 0.6% (PASS)"],
  output: ["baseline/example-collage.svg","current/example-collage.svg","diff/example-diff.svg","diff: 0.6% (pass)"],
  callout: "This tool loads URLs in headless Chromium. Run it only against pages you trust.",
  quickstart: "npx breakpoint-collage-diff --url https://example.com",
  hero: { width: 1600, height: 900 },
  heroAccent: "none",
  icon: {
    inner: `
<rect x="112" y="140" width="240" height="160" rx="24" stroke="{{accent}}" stroke-width="{{stroke}}"/>
<rect x="200" y="220" width="240" height="160" rx="24" stroke="{{accent}}" stroke-width="{{stroke}}"/>
<line x1="256" y1="120" x2="256" y2="392" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
<line x1="232" y1="200" x2="280" y2="200" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
<line x1="232" y1="312" x2="280" y2="312" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
`
  }
};
